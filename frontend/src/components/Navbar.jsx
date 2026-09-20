import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShieldCheck, Phone } from "lucide-react";
import { Logo } from "@/components/Logo";
import { WA_LINK } from "@/data";

const links = [
  { label: "Beranda", href: "#beranda", id: "nav-home-link" },
  { label: "Kursus", href: "#kursus", id: "nav-courses-link" },
  { label: "Pendaftaran", href: "#pendaftaran", id: "nav-registration-link" },
  { label: "Kontak", href: "#kontak", id: "nav-contact-link" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const onLanding = location.pathname === "/";

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[68px] flex items-center justify-between">
        <Link to="/"><Logo /></Link>

        {onLanding && (
          <nav className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <a
                key={l.id}
                data-testid={l.id}
                href={l.href}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2">
          <a
            data-testid="nav-whatsapp-btn"
            href={WA_LINK}
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
          >
            <Phone className="h-4 w-4" /> WhatsApp
          </a>
          <Link
            data-testid="nav-admin-toggle-btn"
            to="/admin"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ShieldCheck className="h-4 w-4" /> Admin
          </Link>
          {onLanding && (
            <button
              data-testid="nav-mobile-toggle"
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 text-slate-700"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          )}
        </div>
      </div>

      {onLanding && open && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1">
          {links.map((l) => (
            <a
              key={l.id}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-blue-50 rounded-lg"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};
