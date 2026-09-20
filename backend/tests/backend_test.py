"""Backend tests for LKP HReDU registration + certificate features."""
import os
import base64
import uuid
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://kursus-digital-1.preview.emergentagent.com').rstrip('/')
API = f"{BASE_URL}/api"
ADMIN_KEY = "Pass123$$"
H = {"X-Admin-Key": ADMIN_KEY}


def _png_bytes():
    return base64.b64decode(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
    )


# --- Fixtures ---
@pytest.fixture(scope="module")
def created_reg_id():
    files = {"bukti": ("proof.png", _png_bytes(), "image/png")}
    data = {
        "nama_lengkap": "TEST_User Satu", "no_hp": "081234567890",
        "email": "test_user1@example.com", "nisn": "1234567890",
        "asal_instansi": "TEST Kampus", "kursus": "mahir-excel",
        "catatan": "TEST catatan",
    }
    r = requests.post(f"{API}/registrations", data=data, files=files, timeout=60)
    assert r.status_code == 200, r.text
    return r.json()["id"]


# --- Courses ---
class TestCourses:
    def test_get_courses(self):
        r = requests.get(f"{API}/courses", timeout=30)
        assert r.status_code == 200
        ids = {c["id"] for c in r.json()}
        assert {"office-profesional", "mahir-excel", "digital-marketing-bnsp", "pilihan-lainnya"} <= ids


# --- Registrations ---
class TestRegistration:
    def test_create_registration_success(self, created_reg_id):
        assert created_reg_id

    def test_reject_bad_file_type(self):
        files = {"bukti": ("bad.txt", b"hello", "text/plain")}
        data = {"nama_lengkap": "TEST_Bad", "no_hp": "081", "email": "b@b.com",
                "nisn": "1", "asal_instansi": "X", "kursus": "mahir-excel"}
        r = requests.post(f"{API}/registrations", data=data, files=files, timeout=30)
        assert r.status_code == 400


# --- Admin gate + registrations ---
class TestAdminGate:
    def test_admin_no_key(self):
        r = requests.get(f"{API}/admin/registrations", timeout=30)
        assert r.status_code == 401

    def test_admin_wrong_key(self):
        r = requests.get(f"{API}/admin/registrations", headers={"X-Admin-Key": "wrong"}, timeout=30)
        assert r.status_code == 401

    def test_admin_verify(self):
        r = requests.get(f"{API}/admin/verify", headers=H, timeout=30)
        assert r.status_code == 200
        assert r.json()["ok"] is True

    def test_admin_list_regs(self, created_reg_id):
        r = requests.get(f"{API}/admin/registrations", headers=H, timeout=30)
        assert r.status_code == 200
        assert any(x["id"] == created_reg_id for x in r.json())

    def test_admin_get_bukti(self, created_reg_id):
        r = requests.get(f"{API}/admin/bukti/{created_reg_id}", params={"key": ADMIN_KEY}, timeout=60)
        assert r.status_code == 200
        assert r.headers.get("content-type", "").startswith("image/")


# --- Certificates ---
class TestCertificates:
    def test_seed_cert_verify_uppercase(self):
        r = requests.get(f"{API}/certificates/verify", params={"nomor": "HRDU/2026/0001"}, timeout=30)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["nomor_sertifikat"] == "HRDU/2026/0001"
        assert d["nama_peserta"] == "Budi Santoso"
        assert d["status"] == "Valid"

    def test_seed_cert_verify_lowercase(self):
        r = requests.get(f"{API}/certificates/verify", params={"nomor": "hrdu/2026/0001"}, timeout=30)
        assert r.status_code == 200
        assert r.json()["nomor_sertifikat"].lower() == "hrdu/2026/0001"

    def test_verify_not_found(self):
        r = requests.get(f"{API}/certificates/verify", params={"nomor": "NOTEXIST/9999"}, timeout=30)
        assert r.status_code == 404

    def test_list_certs_requires_key(self):
        r = requests.get(f"{API}/admin/certificates", timeout=30)
        assert r.status_code == 401

    def test_list_certs_has_seed(self):
        r = requests.get(f"{API}/admin/certificates", headers=H, timeout=30)
        assert r.status_code == 200
        nums = [c["nomor_sertifikat"] for c in r.json()]
        assert "HRDU/2026/0001" in nums

    def test_create_and_verify_and_delete_cert(self):
        nomor = f"TEST/{uuid.uuid4().hex[:8].upper()}"
        payload = {
            "nomor_sertifikat": nomor,
            "nama_peserta": "TEST_Cert User",
            "program": "Kursus Mahir Excel",
            "tanggal_terbit": "2026-01-15",
            "predikat": "Sangat Baik",
            "status": "Valid",
        }
        # Create
        r = requests.post(f"{API}/admin/certificates", json=payload, headers=H, timeout=30)
        assert r.status_code == 200, r.text
        cid = r.json()["id"]
        assert r.json()["nomor_sertifikat"] == nomor
        assert r.json()["nama_peserta"] == "TEST_Cert User"

        # Public verify (case-insensitive)
        r2 = requests.get(f"{API}/certificates/verify", params={"nomor": nomor.lower()}, timeout=30)
        assert r2.status_code == 200
        assert r2.json()["nama_peserta"] == "TEST_Cert User"

        # Duplicate -> 400
        r3 = requests.post(f"{API}/admin/certificates", json=payload, headers=H, timeout=30)
        assert r3.status_code == 400

        # Delete
        r4 = requests.delete(f"{API}/admin/certificates/{cid}", headers=H, timeout=30)
        assert r4.status_code == 200

        # Verify gone
        r5 = requests.get(f"{API}/certificates/verify", params={"nomor": nomor}, timeout=30)
        assert r5.status_code == 404

    def test_create_cert_requires_key(self):
        r = requests.post(f"{API}/admin/certificates", json={
            "nomor_sertifikat": "X/1", "nama_peserta": "X", "program": "X", "tanggal_terbit": "2026-01-01"
        }, timeout=30)
        assert r.status_code == 401
