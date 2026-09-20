import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Star, ExternalLink } from "lucide-react";
import { GOOGLE_BUSINESS_URL } from "@/data";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AV_COLORS = ["bg-blue-600", "bg-emerald-600", "bg-amber-600", "bg-rose-600", "bg-violet-600", "bg-cyan-600", "bg-indigo-600"];

const Stars = ({ n, className = "h-4 w-4" }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star key={i} className={`${className} ${i <= n ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
    ))}
  </div>
);

const GoogleG = ({ className = "h-5 w-5" }) => (
  <svg className={className} viewBox="0 0 48 48" aria-hidden>
    <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" />
    <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" />
    <path fill="#FBBC05" d="M11.69 28.18c-.44-1.32-.69-2.73-.69-4.18s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z" />
    <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z" />
  </svg>
);

export const Testimonials = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios.get(`${API}/reviews`).then((r) => setReviews(r.data)).catch(() => {});
  }, []);

  if (!reviews.length) return null;

  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <section id="testimoni" className="bg-white border-y border-slate-200 py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="text-blue-600 font-bold text-sm tracking-wide uppercase mb-2">Testimoni Alumni</p>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
              Apa Kata Alumni Kami
            </h2>
            <p className="mt-3 text-slate-600">
              Ulasan nyata dari peserta kursus & pelatihan LKP HReDU Global Mandiri.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4">
            <GoogleG className="h-8 w-8" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-2xl font-extrabold text-slate-900" data-testid="reviews-average">{avg}</span>
                <Stars n={Math.round(avg)} />
              </div>
              <p className="text-xs text-slate-500 mt-0.5" data-testid="reviews-count">Berdasarkan {reviews.length} ulasan Google</p>
            </div>
            <a
              data-testid="reviews-google-link"
              href={GOOGLE_BUSINESS_URL}
              target="_blank"
              rel="noreferrer"
              className="ml-2 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              Lihat di Google <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.slice(0, 6).map((r, i) => (
            <motion.div
              key={r.id}
              data-testid="testimonial-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
              className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:shadow-slate-200/60 transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`h-11 w-11 rounded-full ${AV_COLORS[i % AV_COLORS.length]} text-white flex items-center justify-center font-display font-bold text-lg`}>
                    {r.author_name.trim().charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 leading-tight">{r.author_name}</p>
                    <p className="text-xs text-slate-400">{r.relative_time || "Ulasan Google"}</p>
                  </div>
                </div>
                <GoogleG />
              </div>
              <Stars n={r.rating} />
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">{r.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
