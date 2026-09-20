import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Star, MessageSquareQuote, RefreshCw, Pencil, X, Save } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const EMPTY = { author_name: "", rating: "5", text: "", relative_time: "" };

export const ReviewAdmin = ({ adminKey }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);

  const headers = { "X-Admin-Key": adminKey };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/reviews`);
      setRows(res.data);
    } catch {
      toast.error("Gagal memuat ulasan");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const startEdit = (r) => {
    setEditingId(r.id);
    setForm({ author_name: r.author_name, rating: String(r.rating), text: r.text, relative_time: r.relative_time || "" });
    document.getElementById("review-form-anchor")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const cancelEdit = () => { setEditingId(null); setForm(EMPTY); };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, rating: Number(form.rating) };
    try {
      if (editingId) {
        await axios.put(`${API}/admin/reviews/${editingId}`, payload, { headers });
        toast.success("Ulasan diperbarui");
      } else {
        await axios.post(`${API}/admin/reviews`, payload, { headers });
        toast.success("Ulasan ditambahkan");
      }
      setForm(EMPTY);
      setEditingId(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Gagal menyimpan ulasan");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Hapus ulasan ini?")) return;
    try {
      await axios.delete(`${API}/admin/reviews/${id}`, { headers });
      toast.success("Ulasan dihapus");
      setRows((r) => r.filter((x) => x.id !== id));
    } catch {
      toast.error("Gagal menghapus");
    }
  };

  const inputCls = "w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition text-sm";

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <form id="review-form-anchor" data-testid="review-form" onSubmit={submit} className={`lg:col-span-2 bg-white rounded-2xl border p-6 space-y-3.5 h-fit ${editingId ? "border-blue-400 ring-2 ring-blue-100" : "border-slate-200"}`}>
        <div className="flex items-center gap-2 mb-1">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${editingId ? "bg-amber-100" : "bg-blue-100"}`}>
            {editingId ? <Pencil className="h-5 w-5 text-amber-600" /> : <MessageSquareQuote className="h-5 w-5 text-blue-600" />}
          </div>
          <h3 className="font-display text-lg font-bold text-slate-900">{editingId ? "Edit Ulasan" : "Tambah Ulasan"}</h3>
          {editingId && (
            <button type="button" data-testid="review-cancel-edit-btn" onClick={cancelEdit} className="ml-auto p-1.5 hover:bg-slate-100 rounded-lg text-slate-500">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Pemberi Ulasan</label>
          <input data-testid="review-input-author" name="author_name" required value={form.author_name} onChange={change} placeholder="mis. Rina Kusuma" className={inputCls} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Rating</label>
            <select data-testid="review-input-rating" name="rating" value={form.rating} onChange={change} className={`${inputCls} bg-white`}>
              {[5, 4, 3, 2, 1].map((n) => <option key={n} value={String(n)}>{n} Bintang</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Waktu</label>
            <input data-testid="review-input-time" name="relative_time" value={form.relative_time} onChange={change} placeholder="mis. 2 minggu lalu" className={inputCls} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Isi Ulasan</label>
          <textarea data-testid="review-input-text" name="text" required rows={4} value={form.text} onChange={change} placeholder="Tulis isi ulasan peserta..." className={`${inputCls} resize-none`} />
        </div>
        <button data-testid="review-submit-btn" type="submit" disabled={saving} className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors">
          {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : editingId ? <><Save className="h-4.5 w-4.5" /> Simpan Perubahan</> : <><Plus className="h-4.5 w-4.5" /> Simpan Ulasan</>}
        </button>
      </form>

      <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <p className="font-display font-bold text-slate-900">Daftar Ulasan ({rows.length})</p>
          <button data-testid="review-refresh-btn" onClick={load} className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50">
            <RefreshCw className={`h-4 w-4 text-slate-600 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
        <div className="divide-y divide-slate-100 max-h-[560px] overflow-y-auto">
          {loading ? (
            <div className="text-center py-12 text-slate-400"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div>
          ) : rows.length === 0 ? (
            <div className="text-center py-12 text-slate-400">Belum ada ulasan. Tambahkan dari form di samping.</div>
          ) : (
            rows.map((r) => (
              <div key={r.id} data-testid="review-row" className="p-4 flex items-start gap-3 hover:bg-slate-50">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-900">{r.author_name}</p>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((i) => <Star key={i} className={`h-3.5 w-3.5 ${i <= r.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />)}
                    </div>
                    {r.relative_time && <span className="text-xs text-slate-400">· {r.relative_time}</span>}
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{r.text}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button data-testid="review-edit-btn" onClick={() => startEdit(r)} className={`p-1.5 rounded-lg ${editingId === r.id ? "bg-amber-100 text-amber-600" : "hover:bg-blue-50 text-blue-600"}`}>
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button data-testid="review-delete-btn" onClick={() => remove(r.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
