import { LOGO_URL, ADMIN_PHONE, WA_LINK } from "@/data";
import { MapPin, Phone, Mail } from "lucide-react";

export const Footer = () => (
  <footer id="kontak" className="bg-slate-900 text-slate-300 mt-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid md:grid-cols-3 gap-8">
      <div>
        <div className="flex items-center gap-2.5 mb-4">
          <img src={LOGO_URL} alt="Logo" className="h-11 w-11 object-contain bg-white rounded-lg p-1" />
          <div>
            <p className="font-display font-extrabold text-white">HReDU Global Mandiri</p>
            <p className="text-xs text-slate-400">Kursus, Pelatihan & Sertifikasi BNSP</p>
          </div>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed">
          Lembaga Kursus dan Pelatihan resmi yang berkomitmen mencetak SDM kompeten dan tersertifikasi.
        </p>
      </div>

      <div>
        <h4 className="font-display font-bold text-white mb-4">Kontak Kami</h4>
        <ul className="space-y-3 text-sm">
          <li className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-blue-400 shrink-0" />
            <a data-testid="footer-phone" href={WA_LINK} target="_blank" rel="noreferrer" className="hover:text-white">
              {ADMIN_PHONE} (WhatsApp Admin)
            </a>
          </li>
          <li className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-blue-400 shrink-0" />
            <span>info@hredu-mandiri.id</span>
          </li>
          <li className="flex items-start gap-3">
            <MapPin className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
            <span>Kantor LKP HReDU Global Mandiri, Indonesia</span>
          </li>
        </ul>
      </div>

      <div>
        <h4 className="font-display font-bold text-white mb-4">Program</h4>
        <ul className="space-y-2 text-sm text-slate-400">
          <li>Ms Office Profesional</li>
          <li>Mahir Excel</li>
          <li>Digital Marketing & BNSP</li>
          <li>Pelatihan Custom & Corporate</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-slate-800 py-5 text-center text-xs text-slate-500">
      © {new Date().getFullYear()} LKP HReDU Global Mandiri. Seluruh hak cipta dilindungi.
    </div>
  </footer>
);
