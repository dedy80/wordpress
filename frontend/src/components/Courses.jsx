import { motion } from "framer-motion";
import { Check, Clock, ArrowRight } from "lucide-react";
import { COURSES } from "@/data";

const badgeColor = {
  Terpopuler: "bg-blue-100 text-blue-700",
  "Best Seller": "bg-emerald-100 text-emerald-700",
  "BNSP Certified": "bg-amber-100 text-amber-800",
  Custom: "bg-slate-200 text-slate-700",
};

export const Courses = ({ onSelect }) => (
  <section id="kursus" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
    <div className="max-w-2xl">
      <p className="text-blue-600 font-bold text-sm tracking-wide uppercase mb-2">Program Unggulan</p>
      <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
        Pilihan Kursus & Pelatihan
      </h2>
      <p className="mt-3 text-slate-600">
        Program dirancang bersama praktisi industri, dengan kurikulum aplikatif dan sertifikat kompetensi.
      </p>
    </div>

    <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {COURSES.map((c, i) => (
        <motion.div
          key={c.id}
          data-testid={`course-card-${c.id}`}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.08 }}
          className="group flex flex-col bg-white rounded-2xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 transition-all"
        >
          <div className="-mx-5 -mt-5 mb-4 relative overflow-hidden rounded-t-2xl">
            <img
              src={c.image}
              alt={c.title}
              loading="lazy"
              className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
            <span className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full ${badgeColor[c.badge] || "bg-slate-100 text-slate-600"}`}>
              {c.badge}
            </span>
          </div>
          <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-wide">{c.category}</p>
          <h3 className="font-display text-lg font-bold text-slate-900 mt-1 leading-snug min-h-[3.5rem]">{c.title}</h3>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 mb-3">
            <Clock className="h-3.5 w-3.5" /> {c.duration}
          </div>

          <ul className="space-y-2 mb-4 flex-1">
            {c.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2 text-[13px] text-slate-600">
                <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" /> {h}
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-3 border-t border-slate-100">
            <div className="flex items-end gap-2 mb-3">
              <span className="font-display text-xl font-extrabold text-slate-900">{c.price}</span>
              {c.original_price && (
                <span className="text-sm text-slate-400 line-through mb-0.5">{c.original_price}</span>
              )}
            </div>
            <button
              data-testid={`course-select-${c.id}`}
              onClick={() => onSelect(c.title)}
              className="w-full inline-flex items-center justify-center gap-2 bg-blue-50 group-hover:bg-blue-600 text-blue-700 group-hover:text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
            >
              Pilih & Daftar <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);
