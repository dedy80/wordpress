# PRD — LKP HReDU Global Mandiri (Web Pendaftaran Kursus & Sertifikasi BNSP)

## Original Problem Statement
Buat web pendaftaran Kursus dan Pelatihan serta Sertifikasi BNSP yang diselenggarakan LKP HReDU Global Mandiri. Pilihan kursus: (1) Ms Office Profesional, (2) Mahir Excel, (3) Digital Marketing & Sertifikasi BNSP, (4) Pilihan lainnya. Ada upload bukti pembayaran.

## User Choices
- Tanpa login peserta; form pendaftaran publik + halaman admin sederhana untuk lihat data.
- Pembayaran: transfer manual, upload bukti (info rekening ditampilkan).
- Admin hanya melihat daftar pendaftar (tanpa approve/reject).
- Field: Nama Lengkap, No HP, Email, NISN, Asal Kampus/Sekolah, Pilihan Kursus (+ catatan opsional).
- Desain biru-putih, modern profesional, logo, No admin 085171114889.

## Architecture
- Frontend: React (CRA) + Tailwind + shadcn/ui + framer-motion + sonner. Routes: `/` (Landing), `/admin`.
- Backend: FastAPI, semua route prefix `/api`. Motor/MongoDB.
- Object storage: Emergent objstore untuk bukti pembayaran (EMERGENT_LLM_KEY).
- Admin gating: passcode via header `X-Admin-Key` (ADMIN_KEY di backend/.env = hredu2024). Bukan auth penuh.

## Personas
- Calon peserta: mendaftar kursus, transfer, unggah bukti.
- Admin LKP: melihat & mencari data pendaftar, melihat bukti pembayaran.

## Implemented (2026-06)
- Landing: hero, 4 kartu kursus (data statis dgn harga/highlight), section pendaftaran, footer, tombol WhatsApp mengambang.
- Form pendaftaran publik dgn upload bukti (JPG/PNG/PDF, maks 10MB) + preview; success screen.
- Endpoint: GET /api/courses, POST /api/registrations (multipart), GET /api/admin/verify, GET /api/admin/registrations, GET /api/admin/bukti/{id}?key=.
- Admin dashboard: login key, stat total, tabel pendaftar, search, filter kursus, modal lihat bukti pembayaran.
- Logo custom (generated) & tema biru-putih. Nomor admin 085171114889 di hero, navbar, footer, floating.
- Tested end-to-end: backend 100% (10/10 pytest), frontend 100%.

## Backlog / Next (P1/P2)
- P1: Status verifikasi pendaftaran (approve/reject) bila diperlukan.
- P1: Notifikasi WhatsApp/email otomatis ke peserta setelah daftar.
- P2: Export data pendaftar ke Excel/CSV.
- P2: Halaman detail tiap kursus + kuota/jadwal batch.
- P2: Auth admin penuh (multi-user) menggantikan passcode tunggal.

## Credentials
- Admin key: `hredu2024` (backend/.env ADMIN_KEY). Lihat /app/memory/test_credentials.md.
