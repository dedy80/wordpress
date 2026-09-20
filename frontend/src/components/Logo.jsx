import { LOGO_URL } from "@/data";

export const Logo = ({ className = "h-9 sm:h-10" }) => (
  <div className="flex items-center" data-testid="nav-brand-logo">
    <img src={LOGO_URL} alt="LKP HReDU Global Mandiri" className={`${className} w-auto object-contain`} />
  </div>
);
