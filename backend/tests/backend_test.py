"""Backend tests for LKP HReDU registration app."""
import io
import os
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://kursus-digital-1.preview.emergentagent.com').rstrip('/')
API = f"{BASE_URL}/api"
ADMIN_KEY = "hredu2024"


def _png_bytes():
    # minimal 1x1 PNG
    import base64
    return base64.b64decode(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
    )


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
    j = r.json()
    assert j["nama_lengkap"] == "TEST_User Satu"
    assert j["email"] == "test_user1@example.com"
    assert j["bukti_path"]
    return j["id"]


class TestCourses:
    def test_get_courses(self):
        r = requests.get(f"{API}/courses", timeout=30)
        assert r.status_code == 200
        courses = r.json()
        assert len(courses) == 4
        ids = {c["id"] for c in courses}
        assert {"office-profesional", "mahir-excel", "digital-marketing-bnsp", "pilihan-lainnya"} <= ids


class TestRegistration:
    def test_create_registration_success(self, created_reg_id):
        assert created_reg_id

    def test_reject_bad_file_type(self):
        files = {"bukti": ("bad.txt", b"hello", "text/plain")}
        data = {
            "nama_lengkap": "TEST_Bad", "no_hp": "081", "email": "b@b.com",
            "nisn": "1", "asal_instansi": "X", "kursus": "mahir-excel",
        }
        r = requests.post(f"{API}/registrations", data=data, files=files, timeout=30)
        assert r.status_code == 400
        assert "JPG" in r.json()["detail"] or "PNG" in r.json()["detail"]

    def test_reject_large_file(self):
        big = b"x" * (10 * 1024 * 1024 + 10)
        files = {"bukti": ("big.png", big, "image/png")}
        data = {
            "nama_lengkap": "TEST_Big", "no_hp": "081", "email": "b2@b.com",
            "nisn": "1", "asal_instansi": "X", "kursus": "mahir-excel",
        }
        r = requests.post(f"{API}/registrations", data=data, files=files, timeout=60)
        assert r.status_code == 400
        assert "10MB" in r.json()["detail"]


class TestAdmin:
    def test_admin_no_key(self):
        r = requests.get(f"{API}/admin/registrations", timeout=30)
        assert r.status_code == 401

    def test_admin_wrong_key(self):
        r = requests.get(f"{API}/admin/registrations", headers={"X-Admin-Key": "wrong"}, timeout=30)
        assert r.status_code == 401

    def test_admin_verify(self):
        r = requests.get(f"{API}/admin/verify", headers={"X-Admin-Key": ADMIN_KEY}, timeout=30)
        assert r.status_code == 200
        assert r.json()["ok"] is True

    def test_admin_list(self, created_reg_id):
        r = requests.get(f"{API}/admin/registrations", headers={"X-Admin-Key": ADMIN_KEY}, timeout=30)
        assert r.status_code == 200
        regs = r.json()
        assert any(x["id"] == created_reg_id for x in regs)

    def test_admin_get_bukti(self, created_reg_id):
        r = requests.get(f"{API}/admin/bukti/{created_reg_id}", params={"key": ADMIN_KEY}, timeout=60)
        assert r.status_code == 200
        assert r.headers.get("content-type", "").startswith("image/")
        assert len(r.content) > 0

    def test_admin_get_bukti_wrong_key(self, created_reg_id):
        r = requests.get(f"{API}/admin/bukti/{created_reg_id}", params={"key": "nope"}, timeout=30)
        assert r.status_code == 401
