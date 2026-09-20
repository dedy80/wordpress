import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { BadgeCheck, Search, Loader2, XCircle, CheckCircle2, User, GraduationCap, Calendar, Hash, Award } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const fmtDate = (s) => {
  const d = new Date(s);
  if (isNaN(d)) return s;
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
};

export default function Validasi() {
  const [nomor, setNomor] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const check = async (e) => {
    e.preventDefault();
    if (!nomor.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.get(`${API}/certificates/verify`, { params: { nomor: nomor.trim() } });
      setResult({ ok: true, data: res.data });
    } catch {
      setResult({ ok: false });
    } finally {
      setLoading(false);
    }
  };

  const rows = result?.ok
    ? [
        { icon: User, label: "Nama Peserta", value: result.data.nama_peserta },
        { icon: GraduationCap, label: "Program", value: result.data.program },
        { icon: Hash, label: "Nomor Sertifikat", value: result.data.nomor_sertifikat },
        { icon: Calendar, label: "Tanggal Terbit", value: fmtDate(result.data.tanggal_terbit) },
        ...(result.data.predikat ? [{ icon: Award, label: "Predikat", value: result.data.predikat }] : []),
      ]
    : [];

  return (
    <div className="min-h-screen bg-[#FAFAFC]">
      <Navbar />

      <section className="relative overflow-hidden bg-[#0F2C59]">
        <div className="absolute inset-0 hredu-grid-bg opacity-30" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-200 text-xs font-bold mb-5">
            <BadgeCheck className="h-4 w-4" /> Verifikasi Keaslian Sertifikat
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            Validasi Sertifikat LKP HReDU
          </h1>
          <p className="mt-4 text-blue-100/90 max-w-xl mx-auto">
            Masukkan nomor sertifikat untuk memverifikasi keaslian dan status sertifikat yang diterbitkan.
          </p>

          <form onSubmit={check} data-testid="validasi-form" className="mt-8 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                data-testid="validasi-input"
                value={nomor}
                onChange={(e) => setNomor(e.target.value)}
                placeholder="Contoh: HRDU/2026/0001"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-400 text-slate-900"
              />
            </div>
            <button
              data-testid="validasi-submit-btn"
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold py-3.5 px-7 rounded-xl transition-colors"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Cek Sertifikat"}
            </button>
          </form>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12 min-h-[30vh]">
        {result?.ok && (
          <motion.div
            data-testid="validasi-result-valid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-emerald-200 shadow-lg overflow-hidden"
          >
            <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-4 flex items-center gap-3">
              <CheckCircle2 className="h-7 w-7 text-emerald-600" />
              <div>
                <p className="font-display font-bold text-emerald-800 text-lg">Sertifikat Valid</p>
                <p className="text-sm text-emerald-600">Sertifikat terverifikasi & terdaftar resmi di LKP HReDU Global Mandiri.</p>
              </div>
              <span className="ml-auto text-xs font-bold px-3 py-1 rounded-full bg-emerald-600 text-white">
                {result.data.status}
              </span>
            </div>
            <div className="p-6 divide-y divide-slate-100">
              {rows.map((r) => (
                <div key={r.label} className="flex items-start gap-3 py-3">
                  <r.icon className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{r.label}</p>
                    <p className="text-slate-900 font-semibold">{r.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {result && !result.ok && (
          <motion.div
            data-testid="validasi-result-notfound"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-red-200 p-8 text-center"
          >
            <div className="mx-auto w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="font-display text-xl font-bold text-slate-900">Sertifikat Tidak Ditemukan</h3>
            <p className="text-slate-500 mt-2">
              Nomor sertifikat tidak terdaftar. Pastikan penulisan nomor sudah benar atau hubungi admin.
            </p>
          </motion.div>
        )}
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
