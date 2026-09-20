import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, CheckCircle2, Award } from "lucide-react";
import { WA_LINK, HERO_BG, ADMIN_PHONE } from "@/data";

const badges = [
  "Mitra Resmi Uji Kompetensi BNSP",
  "Instruktur Praktisi Industri",
  "Kelas Online & Offline",
  "Sertifikat Kompetensi Kerja",
];

const stats = [
  { value: "1.200+", label: "Alumni Tersertifikasi" },
  { value: "15+", label: "Program Kursus" },
  { value: "98%", label: "Tingkat Kelulusan" },
];

export const Hero = () => {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="beranda" className="relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={HERO_BG} alt="Suasana kelas LKP HReDU" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F2C59]/95 via-[#0F2C59]/85 to-[#0F2C59]/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F3F]/70 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-28">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 text-xs font-bold mb-5 backdrop-blur-sm"
          >
            <Award className="h-4 w-4" /> Lembaga Kursus & Pelatihan Terpercaya
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="font-display text-3xl sm:text-4xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08]"
          >
            Tingkatkan Skill & Raih{" "}
            <span className="text-blue-400">Sertifikasi BNSP</span> Resmi
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-5 text-base sm:text-lg text-blue-100/90 leading-relaxed max-w-xl"
          >
            LKP HReDU Global Mandiri menyediakan program kursus praktik langsung,
            fleksibel, dan sertifikasi resmi BNSP untuk akselerasi karir Anda.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-8 flex flex-col sm:flex-row gap-3"
          >
            <button
              data-testid="hero-register-cta"
              onClick={() => scrollTo("pendaftaran")}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 px-7 rounded-xl shadow-lg shadow-blue-900/40 transition-colors"
            >
              Daftar Kursus Sekarang <ArrowRight className="h-4.5 w-4.5" />
            </button>
            <a
              data-testid="hero-whatsapp-cta"
              href={WA_LINK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/25 font-semibold py-3.5 px-6 rounded-xl backdrop-blur-sm transition-colors"
            >
              <MessageCircle className="h-4.5 w-4.5 text-green-400" /> Konsultasi ({ADMIN_PHONE})
            </a>
          </motion.div>

          <div className="mt-8 grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
            {badges.map((b) => (
              <div key={b} className="flex items-center gap-2 text-sm text-blue-50">
                <CheckCircle2 className="h-4.5 w-4.5 text-blue-400 shrink-0" /> {b}
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.28 }}
          className="mt-12 flex flex-wrap gap-8 sm:gap-14 border-t border-white/15 pt-8"
        >
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-display text-3xl sm:text-4xl font-extrabold text-white">{s.value}</p>
              <p className="text-xs sm:text-sm text-blue-200 font-medium mt-0.5">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
