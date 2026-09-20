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
- Landing: hero full-bleed dengan foto pelatihan + overlay biru navy, badge BNSP, CTA, baris statistik.
- 4 kartu kursus (harga & durasi terkini), section pendaftaran, footer, tombol WhatsApp mengambang.
- Form pendaftaran publik dgn upload bukti (JPG/PNG/PDF, maks 10MB) + preview; success screen dgn tombol "Konfirmasi via WhatsApp ke Admin" (pesan pre-filled).
- Validasi Sertifikat publik (/validasi): cek nomor sertifikat, hasil Valid/Tidak Ditemukan (case-insensitive).
- Admin (passcode `Pass123$$`) dengan 3 tab: Data Pendaftar, Data Sertifikat, Ulasan Google.
- Endpoint kursus/pendaftaran/sertifikat + verify publik. Logo brand resmi, rekening BCA 690-1044888 (PT. HREDU Global Mandiri).

## Fitur Tambahan (2026-06, iterasi 2)
- Status Verifikasi: tombol Verifikasi (Terverifikasi) / Tolak (Ditolak) langsung di tabel admin (kolom Aksi). Backend `PUT /api/admin/registrations/{id}/status` (status valid: Menunggu Konfirmasi / Terverifikasi / Ditolak).
- Notifikasi WhatsApp (link siap-kirim, tanpa biaya/akun): peserta→admin di success screen; admin→peserta via tombol WA per baris tabel (helper `waLink` + normalisasi nomor 08→62).
- Ekspor Data: `GET /api/admin/registrations/export?key=...` menghasilkan file Excel (.xlsx, openpyxl) berisi seluruh pendaftar; tombol "Ekspor Excel" di panel admin.

## Backlog / Next (P1/P2)
- P1: Notifikasi WhatsApp/email otomatis penuh (Twilio) jika ingin terkirim tanpa klik.
- P2: Halaman detail tiap kursus + kuota/jadwal batch.
- P2: Auth admin penuh (multi-user) menggantikan passcode tunggal.

## Credentials
- Admin key: `hredu2024` (backend/.env ADMIN_KEY). Lihat /app/memory/test_credentials.md.
