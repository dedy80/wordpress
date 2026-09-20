import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  ShieldCheck, Loader2, Search, Users, Eye, LogOut, RefreshCw, X, FileText,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { COURSES } from "@/data";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const KEY_STORE = "hredu_admin_key";

const ProofModal = ({ regId, adminKey, onClose }) => {
  const url = `${API}/admin/bukti/${regId}?key=${encodeURIComponent(adminKey)}`;
  return (
    <div
      className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4"
      onClick={onClose}
      data-testid="proof-modal"
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
          <p className="font-display font-bold text-slate-900">Bukti Pembayaran</p>
          <div className="flex items-center gap-2">
            <a href={url} target="_blank" rel="noreferrer" className="text-sm text-blue-600 font-semibold hover:underline">
              Buka Tab Baru
            </a>
            <button onClick={onClose} data-testid="close-proof-btn" className="p-1.5 hover:bg-slate-100 rounded-lg">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-4 bg-slate-50 max-h-[70vh] overflow-auto flex items-center justify-center">
          <img src={url} alt="Bukti" className="max-w-full rounded-lg" onError={(e) => (e.target.style.display = "none")} />
        </div>
      </div>
    </div>
  );
};

const statusColor = {
  "Menunggu Konfirmasi": "bg-amber-100 text-amber-700",
  Terverifikasi: "bg-emerald-100 text-emerald-700",
};

export default function Admin() {
  const [adminKey, setAdminKey] = useState(localStorage.getItem(KEY_STORE) || "");
  const [authed, setAuthed] = useState(false);
  const [keyInput, setKeyInput] = useState("");
  const [checking, setChecking] = useState(false);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [proofId, setProofId] = useState(null);

  const load = useCallback(async (key) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/admin/registrations`, { headers: { "X-Admin-Key": key } });
      setRows(res.data);
      setAuthed(true);
    } catch {
      toast.error("Gagal memuat data / kunci tidak valid");
      setAuthed(false);
      localStorage.removeItem(KEY_STORE);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (adminKey) load(adminKey);
  }, [adminKey, load]);

  const submitKey = async (e) => {
    e.preventDefault();
    setChecking(true);
    try {
      await axios.get(`${API}/admin/verify`, { headers: { "X-Admin-Key": keyInput } });
      localStorage.setItem(KEY_STORE, keyInput);
      setAdminKey(keyInput);
      toast.success("Berhasil masuk");
    } catch {
      toast.error("Kunci admin salah");
    } finally {
      setChecking(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(KEY_STORE);
    setAdminKey("");
    setAuthed(false);
    setRows([]);
  };

  const filtered = rows.filter((r) => {
    const matchQ =
      !q ||
      [r.nama_lengkap, r.email, r.no_hp, r.nisn, r.asal_instansi].some((v) =>
        (v || "").toLowerCase().includes(q.toLowerCase())
      );
    const matchC = courseFilter === "all" || r.kursus === courseFilter;
    return matchQ && matchC;
  });

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#FAFAFC]">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-20">
          <form
            data-testid="admin-login-form"
            onSubmit={submitKey}
            className="bg-white rounded-2xl border border-slate-200 p-8 text-center"
          >
            <div className="mx-auto w-14 h-14 rounded-xl bg-slate-900 flex items-center justify-center mb-4">
              <ShieldCheck className="h-7 w-7 text-white" />
            </div>
            <h1 className="font-display text-2xl font-bold text-slate-900">Panel Admin</h1>
            <p className="text-slate-500 text-sm mt-1 mb-6">Masukkan kunci admin untuk melihat data pendaftar.</p>
            <input
              data-testid="admin-key-input"
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="Kunci Admin"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none mb-3 text-center"
            />
            <button
              data-testid="admin-login-btn"
              type="submit"
              disabled={checking}
              className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {checking ? <Loader2 className="h-5 w-5 animate-spin" /> : "Masuk"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFC]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">Data Pendaftar</h1>
            <p className="text-slate-500 text-sm">Kelola & lihat seluruh pendaftaran kursus.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              data-testid="admin-refresh-btn"
              onClick={() => load(adminKey)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Muat Ulang
            </button>
            <button
              data-testid="admin-logout-btn"
              onClick={logout}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl"
            >
              <LogOut className="h-4 w-4" /> Keluar
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="font-display text-2xl font-extrabold text-slate-900" data-testid="stat-total">{rows.length}</p>
              <p className="text-xs text-slate-500 font-medium">Total Pendaftar</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 sm:col-span-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                data-testid="admin-search-input"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cari nama, email, HP, instansi..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
              />
            </div>
            <select
              data-testid="admin-course-filter"
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none text-sm bg-white"
            >
              <option value="all">Semua Kursus</option>
              {COURSES.map((c) => (
                <option key={c.id} value={c.title}>{c.title}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Peserta</th>
                  <th className="text-left px-4 py-3 font-semibold">Kontak</th>
                  <th className="text-left px-4 py-3 font-semibold">NISN/NIK</th>
                  <th className="text-left px-4 py-3 font-semibold">Instansi</th>
                  <th className="text-left px-4 py-3 font-semibold">Kursus</th>
                  <th className="text-left px-4 py-3 font-semibold">Tanggal</th>
                  <th className="text-center px-4 py-3 font-semibold">Bukti</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan={7} className="text-center py-12 text-slate-400"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-12 text-slate-400">Belum ada data pendaftar.</td></tr>
                ) : (
                  filtered.map((r) => (
                    <tr key={r.id} data-testid="admin-registrant-row" className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-900">{r.nama_lengkap}</p>
                        <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor[r.status] || "bg-slate-100 text-slate-600"}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        <p>{r.no_hp}</p>
                        <p className="text-xs text-slate-400">{r.email}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{r.nisn}</td>
                      <td className="px-4 py-3 text-slate-600">{r.asal_instansi}</td>
                      <td className="px-4 py-3 text-slate-600 max-w-[180px]">{r.kursus}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                        {new Date(r.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {r.bukti_path ? (
                          <button
                            data-testid="admin-view-proof-btn"
                            onClick={() => setProofId(r.id)}
                            className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-semibold text-xs"
                          >
                            <Eye className="h-4 w-4" /> Lihat
                          </button>
                        ) : (
                          <span className="text-slate-300"><FileText className="h-4 w-4 mx-auto" /></span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {proofId && <ProofModal regId={proofId} adminKey={adminKey} onClose={() => setProofId(null)} />}
    </div>
  );
}
