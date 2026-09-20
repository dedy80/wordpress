import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, CheckCircle2, Award } from "lucide-react";
import { WA_LINK, HERO_IMAGE, ADMIN_PHONE } from "@/data";

const badges = [
  "Mitra Resmi Uji Kompetensi BNSP",
  "Instruktur Praktisi Industri",
  "Kelas Online & Offline",
  "Sertifikat Kompetensi Kerja",
];

export const Hero = () => {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="beranda" className="relative overflow-hidden hredu-grid-bg">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-blue-50/60" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-5"
          >
            <Award className="h-4 w-4" /> Lembaga Kursus & Pelatihan Terpercaya
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.1]"
          >
            Tingkatkan Skill & Raih{" "}
            <span className="text-blue-600">Sertifikasi BNSP</span> Resmi
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl"
          >
            LKP HReDU Global Mandiri menyediakan program kursus praktik langsung,
            fleksibel, dan sertifikasi resmi BNSP untuk akselerasi karir Anda.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-7 flex flex-col sm:flex-row gap-3"
          >
            <button
              data-testid="hero-register-cta"
              onClick={() => scrollTo("pendaftaran")}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-7 rounded-xl shadow-lg shadow-blue-500/25 transition-colors"
            >
              Daftar Kursus Sekarang <ArrowRight className="h-4.5 w-4.5" />
            </button>
            <a
              data-testid="hero-whatsapp-cta"
              href={WA_LINK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold py-3.5 px-6 rounded-xl transition-colors"
            >
              <MessageCircle className="h-4.5 w-4.5 text-green-600" /> Konsultasi ({ADMIN_PHONE})
            </a>
          </motion.div>

          <div className="mt-8 grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
            {badges.map((b) => (
              <div key={b} className="flex items-center gap-2 text-sm text-slate-700">
                <CheckCircle2 className="h-4.5 w-4.5 text-blue-600 shrink-0" /> {b}
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-blue-600/10 rounded-3xl rotate-3" />
          <img
            src={HERO_IMAGE}
            alt="Peserta kursus LKP HReDU"
            className="relative rounded-2xl shadow-2xl w-full h-[340px] sm:h-[440px] object-cover"
          />
          <div className="absolute -bottom-5 left-5 bg-white rounded-xl shadow-xl px-5 py-3.5 border border-slate-100">
            <p className="font-display text-2xl font-extrabold text-blue-600">1.200+</p>
            <p className="text-xs text-slate-500 font-medium">Alumni Tersertifikasi</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
