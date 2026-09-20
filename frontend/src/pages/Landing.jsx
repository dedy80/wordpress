import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Courses } from "@/components/Courses";
import { Testimonials } from "@/components/Testimonials";
import { RegistrationForm } from "@/components/RegistrationForm";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

export default function Landing() {
  const [selectedCourse, setSelectedCourse] = useState("");

  const selectCourse = (title) => {
    setSelectedCourse(title);
    document.getElementById("pendaftaran")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC]">
      <Navbar />
      <Hero />
      <Courses onSelect={selectCourse} />
      <Testimonials />

      <section id="pendaftaran" className="bg-slate-50 border-y border-slate-200 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-10">
            <p className="text-blue-600 font-bold text-sm tracking-wide uppercase mb-2">Pendaftaran</p>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
              Daftar & Unggah Bukti Pembayaran
            </h2>
            <p className="mt-3 text-slate-600">
              Lengkapi data diri, lakukan transfer ke rekening resmi, lalu unggah bukti pembayaran Anda.
            </p>
          </div>
          <RegistrationForm selectedCourse={selectedCourse} />
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
