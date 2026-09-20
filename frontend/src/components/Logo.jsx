import { LOGO_URL } from "@/data";

export const Logo = ({ className = "h-10 w-10", showText = true }) => (
  <div className="flex items-center gap-2.5" data-testid="nav-brand-logo">
    <img src={LOGO_URL} alt="Logo HReDU" className={`${className} object-contain`} />
    {showText && (
      <div className="leading-tight">
        <p className="font-display font-extrabold text-slate-900 text-[15px] sm:text-base">
          HReDU <span className="text-blue-600">Global Mandiri</span>
        </p>
        <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium tracking-wide">
          Lembaga Kursus, Pelatihan & Sertifikasi BNSP
        </p>
      </div>
    )}
  </div>
);
