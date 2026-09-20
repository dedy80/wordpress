import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Search, Award, RefreshCw, Pencil, X, Save } from "lucide-react";
import { COURSES } from "@/data";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const EMPTY = { nomor_sertifikat: "", nama_peserta: "", program: "", tanggal_terbit: "", predikat: "", status: "Valid" };

export const CertAdmin = ({ adminKey }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [q, setQ] = useState("");
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);

  const headers = { "X-Admin-Key": adminKey };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/admin/certificates`, { headers });
      setRows(res.data);
    } catch {
      toast.error("Gagal memuat data sertifikat");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminKey]);

  useEffect(() => { load(); }, [load]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const startEdit = (r) => {
    setEditingId(r.id);
    setForm({
      nomor_sertifikat: r.nomor_sertifikat,
      nama_peserta: r.nama_peserta,
      program: r.program,
      tanggal_terbit: r.tanggal_terbit,
      predikat: r.predikat || "",
      status: r.status,
    });
    document.getElementById("cert-form-anchor")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await axios.put(`${API}/admin/certificates/${editingId}`, form, { headers });
        toast.success("Sertifikat berhasil diperbarui");
      } else {
        await axios.post(`${API}/admin/certificates`, form, { headers });
        toast.success("Sertifikat berhasil ditambahkan");
      }
      setForm(EMPTY);
      setEditingId(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Gagal menyimpan sertifikat");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Hapus data sertifikat ini?")) return;
    try {
      await axios.delete(`${API}/admin/certificates/${id}`, { headers });
      toast.success("Sertifikat dihapus");
      setRows((r) => r.filter((x) => x.id !== id));
    } catch {
      toast.error("Gagal menghapus");
    }
  };

  const filtered = rows.filter(
    (r) => !q || [r.nomor_sertifikat, r.nama_peserta, r.program].some((v) => (v || "").toLowerCase().includes(q.toLowerCase()))
  );

  const inputCls = "w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition text-sm";

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <form id="cert-form-anchor" data-testid="cert-form" onSubmit={submit} className={`lg:col-span-2 bg-white rounded-2xl border p-6 space-y-3.5 h-fit ${editingId ? "border-blue-400 ring-2 ring-blue-100" : "border-slate-200"}`}>
        <div className="flex items-center gap-2 mb-1">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${editingId ? "bg-amber-100" : "bg-blue-100"}`}>
            {editingId ? <Pencil className="h-5 w-5 text-amber-600" /> : <Award className="h-5 w-5 text-blue-600" />}
          </div>
          <h3 className="font-display text-lg font-bold text-slate-900">{editingId ? "Edit Sertifikat" : "Tambah Sertifikat"}</h3>
          {editingId && (
            <button type="button" data-testid="cert-cancel-edit-btn" onClick={cancelEdit} className="ml-auto p-1.5 hover:bg-slate-100 rounded-lg text-slate-500">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nomor Sertifikat</label>
          <input data-testid="cert-input-nomor" name="nomor_sertifikat" required value={form.nomor_sertifikat} onChange={change} placeholder="HRDU/2026/0001" className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Peserta</label>
          <input data-testid="cert-input-nama" name="nama_peserta" required value={form.nama_peserta} onChange={change} placeholder="Nama lengkap peserta" className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Program</label>
          <input data-testid="cert-input-program" name="program" required list="program-list" value={form.program} onChange={change} placeholder="Nama program / kursus" className={inputCls} />
          <datalist id="program-list">
            {COURSES.map((c) => <option key={c.id} value={c.title} />)}
          </datalist>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tanggal Terbit</label>
            <input data-testid="cert-input-tanggal" name="tanggal_terbit" type="date" required value={form.tanggal_terbit} onChange={change} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Predikat</label>
            <input data-testid="cert-input-predikat" name="predikat" value={form.predikat} onChange={change} placeholder="mis. Sangat Baik" className={inputCls} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
          <select data-testid="cert-input-status" name="status" value={form.status} onChange={change} className={`${inputCls} bg-white`}>
            <option value="Valid">Valid</option>
            <option value="Kadaluarsa">Kadaluarsa</option>
            <option value="Dicabut">Dicabut</option>
          </select>
        </div>
        <button data-testid="cert-submit-btn" type="submit" disabled={saving} className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors">
          {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : editingId ? <><Save className="h-4.5 w-4.5" /> Simpan Perubahan</> : <><Plus className="h-4.5 w-4.5" /> Simpan Sertifikat</>}
        </button>
      </form>

      <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input data-testid="cert-search-input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari nomor / nama / program..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none text-sm" />
          </div>
          <button data-testid="cert-refresh-btn" onClick={load} className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50">
            <RefreshCw className={`h-4 w-4 text-slate-600 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Nomor & Peserta</th>
                <th className="text-left px-4 py-3 font-semibold">Program</th>
                <th className="text-left px-4 py-3 font-semibold">Terbit</th>
                <th className="text-center px-4 py-3 font-semibold">Status</th>
                <th className="text-center px-4 py-3 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={5} className="text-center py-12 text-slate-400"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-slate-400">Belum ada data sertifikat.</td></tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} data-testid="cert-row" className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900">{r.nomor_sertifikat}</p>
                      <p className="text-xs text-slate-500">{r.nama_peserta}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600 max-w-[180px]">{r.program}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                      {new Date(r.tanggal_terbit).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${r.status === "Valid" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>{r.status}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="inline-flex items-center gap-1">
                        <button data-testid="cert-edit-btn" onClick={() => startEdit(r)} className={`p-1.5 rounded-lg ${editingId === r.id ? "bg-amber-100 text-amber-600" : "hover:bg-blue-50 text-blue-600"}`}>
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button data-testid="cert-delete-btn" onClick={() => remove(r.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
