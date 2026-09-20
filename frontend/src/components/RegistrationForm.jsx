import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { UploadCloud, FileText, X, Loader2, CheckCircle2, MessageCircle } from "lucide-react";
import { COURSES, waLink, ADMIN_WA } from "@/data";
import { BankInfo } from "@/components/BankInfo";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const EMPTY = { nama_lengkap: "", no_hp: "", email: "", nisn: "", asal_instansi: "", kursus: "", catatan: "" };

const fields = [
  { name: "nama_lengkap", label: "Nama Lengkap", type: "text", placeholder: "Nama sesuai identitas", testid: "form-input-nama-lengkap" },
  { name: "no_hp", label: "No. HP Aktif (WhatsApp)", type: "tel", placeholder: "08xxxxxxxxxx", testid: "form-input-no-hp" },
  { name: "email", label: "Email Aktif", type: "email", placeholder: "nama@email.com", testid: "form-input-email" },
  { name: "nisn", label: "NISN / NIK", type: "text", placeholder: "Nomor NISN atau NIK", testid: "form-input-nisn" },
  { name: "asal_instansi", label: "Asal Kampus / Sekolah", type: "text", placeholder: "Nama institusi", testid: "form-input-asal-instansi" },
];

export const RegistrationForm = ({ selectedCourse }) => {
  const [form, setForm] = useState(EMPTY);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    if (selectedCourse) setForm((f) => ({ ...f, kursus: selectedCourse }));
  }, [selectedCourse]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onFile = (f) => {
    if (!f) return;
    const ok = ["image/jpeg", "image/png", "application/pdf", "image/webp"];
    if (!ok.includes(f.type)) return toast.error("File harus JPG, PNG, atau PDF");
    if (f.size > 10 * 1024 * 1024) return toast.error("Ukuran file maksimal 10MB");
    setFile(f);
    setPreview(f.type.startsWith("image/") ? URL.createObjectURL(f) : null);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.kursus) return toast.error("Silakan pilih kursus terlebih dahulu");
    if (!file) return toast.error("Silakan unggah bukti pembayaran");
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append("bukti", file);
      await axios.post(`${API}/registrations`, fd);
      setDone(true);
      toast.success("Pendaftaran berhasil dikirim!");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Gagal mengirim pendaftaran");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    const adminMsg =
      `Halo Admin LKP HReDU, saya *${form.nama_lengkap}* baru saja mendaftar kursus *${form.kursus}*. ` +
      `No HP: ${form.no_hp}, Email: ${form.email}. Mohon konfirmasi pendaftaran & jadwal. Terima kasih.`;
    return (
      <div data-testid="registration-success" className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
          <CheckCircle2 className="h-9 w-9 text-emerald-600" />
        </div>
        <h3 className="font-display text-2xl font-bold text-slate-900">Pendaftaran Terkirim!</h3>
        <p className="text-slate-600 mt-2 max-w-md mx-auto">
          Terima kasih, <b>{form.nama_lengkap}</b>. Data & bukti pembayaran Anda telah kami terima. Untuk mempercepat
          proses, silakan kirim konfirmasi ke admin melalui WhatsApp.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            data-testid="wa-confirm-admin-btn"
            href={waLink(ADMIN_WA, adminMsg)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            <MessageCircle className="h-5 w-5" /> Konfirmasi via WhatsApp
          </a>
          <button
            data-testid="register-again-btn"
            onClick={() => { setForm(EMPTY); setFile(null); setPreview(null); setDone(false); }}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            Daftar Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <BankInfo />
      </div>

      <form
        data-testid="registration-form"
        onSubmit={submit}
        className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 space-y-4"
      >
        <h3 className="font-display text-xl font-bold text-slate-900">Formulir Pendaftaran</h3>

        {fields.map((f) => (
          <div key={f.name}>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">{f.label}</label>
            <input
              data-testid={f.testid}
              name={f.name}
              type={f.type}
              required
              value={form[f.name]}
              onChange={change}
              placeholder={f.placeholder}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition text-sm"
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Pilihan Kursus</label>
          <select
            data-testid="form-select-kursus"
            name="kursus"
            required
            value={form.kursus}
            onChange={change}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition text-sm bg-white"
          >
            <option value="">-- Pilih Kursus --</option>
            {COURSES.map((c) => (
              <option key={c.id} value={c.title}>{c.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Bukti Pembayaran</label>
          {!file ? (
            <button
              type="button"
              data-testid="form-file-bukti-pembayaran"
              onClick={() => fileRef.current?.click()}
              className="w-full border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-xl py-7 flex flex-col items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors"
            >
              <UploadCloud className="h-8 w-8" />
              <span className="text-sm font-medium">Klik untuk unggah bukti transfer</span>
              <span className="text-xs text-slate-400">JPG, PNG, atau PDF (maks. 10MB)</span>
            </button>
          ) : (
            <div className="border border-slate-200 rounded-xl p-3 flex items-center gap-3" data-testid="bukti-preview">
              {preview ? (
                <img src={preview} alt="preview" className="h-14 w-14 rounded-lg object-cover" />
              ) : (
                <div className="h-14 w-14 rounded-lg bg-blue-50 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{file.name}</p>
                <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(0)} KB</p>
              </div>
              <button
                type="button"
                data-testid="remove-bukti-btn"
                onClick={() => { setFile(null); setPreview(null); }}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={(e) => onFile(e.target.files[0])}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Catatan (opsional)</label>
          <textarea
            data-testid="form-input-catatan"
            name="catatan"
            rows={2}
            value={form.catatan}
            onChange={change}
            placeholder="Pertanyaan atau preferensi jadwal"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition text-sm resize-none"
          />
        </div>

        <button
          type="submit"
          data-testid="form-submit-btn"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-500/25 transition-colors"
        >
          {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> Mengirim...</> : "Kirim Pendaftaran"}
        </button>
      </form>
    </div>
  );
};
