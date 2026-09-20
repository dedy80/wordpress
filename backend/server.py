from fastapi import FastAPI, APIRouter, UploadFile, File, Form, HTTPException, Header, Query, Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import re
import uuid
import requests
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Object storage
STORAGE_BASE = (os.environ.get("INTEGRATION_PROXY_URL") or "").strip() or "https://integrations.emergentagent.com"
STORAGE_URL = STORAGE_BASE.rstrip("/") + "/objstore/api/v1/storage"
EMERGENT_KEY = os.environ.get("EMERGENT_LLM_KEY")
ADMIN_KEY = os.environ.get("ADMIN_KEY")
APP_NAME = "hredu-kursus"

MIME_TYPES = {
    "jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png",
    "gif": "image/gif", "webp": "image/webp", "pdf": "application/pdf",
}

storage_key = None


def init_storage(force: bool = False):
    global storage_key
    if storage_key and not force:
        return storage_key
    resp = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": EMERGENT_KEY}, timeout=30)
    resp.raise_for_status()
    storage_key = resp.json()["storage_key"]
    return storage_key


def put_object(path: str, data: bytes, content_type: str) -> dict:
    key = init_storage()
    resp = requests.put(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key, "Content-Type": content_type},
        data=data, timeout=120,
    )
    if resp.status_code == 404:
        key = init_storage(force=True)
        resp = requests.put(
            f"{STORAGE_URL}/objects/{path}",
            headers={"X-Storage-Key": key, "Content-Type": content_type},
            data=data, timeout=120,
        )
    resp.raise_for_status()
    return resp.json()


def get_object(path: str):
    key = init_storage()
    resp = requests.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": key}, timeout=60)
    if resp.status_code == 404:
        key = init_storage(force=True)
        resp = requests.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": key}, timeout=60)
    resp.raise_for_status()
    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")


app = FastAPI()
api_router = APIRouter(prefix="/api")


# ---------- Models ----------
class Registration(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    nama_lengkap: str
    no_hp: str
    email: EmailStr
    nisn: str
    asal_instansi: str
    kursus: str
    catatan: Optional[str] = ""
    bukti_path: Optional[str] = None
    bukti_filename: Optional[str] = None
    status: str = "Menunggu Konfirmasi"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class Certificate(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    nomor_sertifikat: str
    nama_peserta: str
    program: str
    tanggal_terbit: str
    predikat: Optional[str] = ""
    status: str = "Valid"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class CertificateCreate(BaseModel):
    nomor_sertifikat: str
    nama_peserta: str
    program: str
    tanggal_terbit: str
    predikat: Optional[str] = ""
    status: str = "Valid"


COURSES = [
    {"id": "office-profesional", "title": "Kursus Ms Office Profesional"},
    {"id": "mahir-excel", "title": "Kursus Mahir Excel"},
    {"id": "digital-marketing-bnsp", "title": "Digital Marketing & Sertifikasi BNSP"},
    {"id": "pilihan-lainnya", "title": "Program & Sertifikasi Lainnya"},
]


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "LKP HReDU Global Mandiri API"}


@api_router.get("/courses")
async def get_courses():
    return COURSES


@api_router.post("/registrations", response_model=Registration)
async def create_registration(
    nama_lengkap: str = Form(...),
    no_hp: str = Form(...),
    email: str = Form(...),
    nisn: str = Form(...),
    asal_instansi: str = Form(...),
    kursus: str = Form(...),
    catatan: str = Form(""),
    bukti: UploadFile = File(...),
):
    ext = bukti.filename.split(".")[-1].lower() if "." in bukti.filename else "bin"
    if ext not in MIME_TYPES:
        raise HTTPException(status_code=400, detail="Format file harus JPG, PNG, atau PDF")
    data = await bukti.read()
    if len(data) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Ukuran file maksimal 10MB")

    reg = Registration(
        nama_lengkap=nama_lengkap, no_hp=no_hp, email=email, nisn=nisn,
        asal_instansi=asal_instansi, kursus=kursus, catatan=catatan,
    )
    path = f"{APP_NAME}/bukti/{reg.id}.{ext}"
    content_type = MIME_TYPES.get(ext, "application/octet-stream")
    put_object(path, data, content_type)
    reg.bukti_path = path
    reg.bukti_filename = bukti.filename

    await db.registrations.insert_one(reg.model_dump())
    return reg


def check_admin(admin_key: Optional[str]):
    if not ADMIN_KEY or admin_key != ADMIN_KEY:
        raise HTTPException(status_code=401, detail="Kunci admin tidak valid")


@api_router.get("/admin/registrations", response_model=List[Registration])
async def list_registrations(x_admin_key: Optional[str] = Header(None)):
    check_admin(x_admin_key)
    docs = await db.registrations.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return docs


@api_router.get("/admin/verify")
async def verify_admin(x_admin_key: Optional[str] = Header(None)):
    check_admin(x_admin_key)
    return {"ok": True}


@api_router.get("/admin/bukti/{reg_id}")
async def get_bukti(reg_id: str, key: Optional[str] = Query(None)):
    check_admin(key)
    record = await db.registrations.find_one({"id": reg_id}, {"_id": 0})
    if not record or not record.get("bukti_path"):
        raise HTTPException(status_code=404, detail="Bukti tidak ditemukan")
    data, content_type = get_object(record["bukti_path"])
    return Response(content=data, media_type=content_type)


@api_router.get("/certificates/verify")
async def verify_certificate(nomor: str = Query(...)):
    n = nomor.strip()
    if not n:
        raise HTTPException(status_code=400, detail="Nomor sertifikat wajib diisi")
    doc = await db.certificates.find_one(
        {"nomor_sertifikat": {"$regex": f"^{re.escape(n)}$", "$options": "i"}}, {"_id": 0}
    )
    if not doc:
        raise HTTPException(status_code=404, detail="Sertifikat tidak ditemukan")
    return doc


@api_router.post("/admin/certificates", response_model=Certificate)
async def create_certificate(payload: CertificateCreate, x_admin_key: Optional[str] = Header(None)):
    check_admin(x_admin_key)
    nomor = payload.nomor_sertifikat.strip()
    existing = await db.certificates.find_one(
        {"nomor_sertifikat": {"$regex": f"^{re.escape(nomor)}$", "$options": "i"}}
    )
    if existing:
        raise HTTPException(status_code=400, detail="Nomor sertifikat sudah terdaftar")
    data = payload.model_dump()
    data["nomor_sertifikat"] = nomor
    cert = Certificate(**data)
    await db.certificates.insert_one(cert.model_dump())
    return cert


@api_router.get("/admin/certificates", response_model=List[Certificate])
async def list_certificates(x_admin_key: Optional[str] = Header(None)):
    check_admin(x_admin_key)
    docs = await db.certificates.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return docs


@api_router.put("/admin/certificates/{cert_id}", response_model=Certificate)
async def update_certificate(cert_id: str, payload: CertificateCreate, x_admin_key: Optional[str] = Header(None)):
    check_admin(x_admin_key)
    existing = await db.certificates.find_one({"id": cert_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Sertifikat tidak ditemukan")
    nomor = payload.nomor_sertifikat.strip()
    dup = await db.certificates.find_one(
        {"nomor_sertifikat": {"$regex": f"^{re.escape(nomor)}$", "$options": "i"}, "id": {"$ne": cert_id}}
    )
    if dup:
        raise HTTPException(status_code=400, detail="Nomor sertifikat sudah dipakai sertifikat lain")
    data = payload.model_dump()
    data["nomor_sertifikat"] = nomor
    data["id"] = cert_id
    data["created_at"] = existing.get("created_at")
    cert = Certificate(**data)
    await db.certificates.update_one({"id": cert_id}, {"$set": cert.model_dump()})
    return cert


@api_router.delete("/admin/certificates/{cert_id}")
async def delete_certificate(cert_id: str, x_admin_key: Optional[str] = Header(None)):
    check_admin(x_admin_key)
    await db.certificates.delete_one({"id": cert_id})
    return {"ok": True}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def startup():
    try:
        init_storage()
        logger.info("Storage initialized")
    except Exception as e:
        logger.error(f"Storage init failed: {e}")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
