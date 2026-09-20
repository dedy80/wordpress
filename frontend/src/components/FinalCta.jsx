import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { WA_LINK, ADMIN_PHONE } from "@/data";

export const FinalCta = () => {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative overflow-hidden bg-[#0F2C59]">
      <div className="absolute inset-0 hredu-grid-bg opacity-25" />
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-blue-400/10 blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-200 text-xs font-bold mb-6"
        >
          <Sparkles className="h-4 w-4" /> Mulai Langkah Karir Anda Hari Ini
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight"
        >
          Siap Tingkatkan Skill &<br className="hidden sm:block" /> Raih Sertifikasi Resmi?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="mt-5 text-base sm:text-lg text-blue-100/90 max-w-2xl mx-auto leading-relaxed"
        >
          Daftar sekarang dan konsultasikan kebutuhan kursus untuk karir Anda bersama tim LKP HReDU
          Global Mandiri. Kami bantu pilihkan program yang paling tepat untuk tujuan Anda.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="mt-9 flex flex-col sm:flex-row gap-3 justify-center"
        >
          <button
            data-testid="final-cta-register-btn"
            onClick={() => scrollTo("pendaftaran")}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 px-8 rounded-xl shadow-lg shadow-blue-900/40 transition-colors"
          >
            Daftar Kursus Sekarang <ArrowRight className="h-5 w-5" />
          </button>
          <a
            data-testid="final-cta-consult-btn"
            href={WA_LINK}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/25 font-semibold py-4 px-7 rounded-xl backdrop-blur-sm transition-colors"
          >
            <MessageCircle className="h-5 w-5 text-green-400" /> Konsultasi Gratis ({ADMIN_PHONE})
          </a>
        </motion.div>

        <p className="mt-6 text-sm text-blue-200/80">
          Konsultasi tanpa biaya · Respon cepat via WhatsApp · Jadwal kelas fleksibel
        </p>
      </div>
    </section>
  );
};
