export const LOGO_URL = "https://customer-assets-wrfwihn1.emergentagent.net/job_kursus-digital-1/artifacts/6110svwj_hredu2.png";

export const ADMIN_PHONE = "085171114889";
export const ADMIN_WA = "6285171114889";
export const WA_LINK = "https://wa.me/6285171114889?text=Halo%20Admin%20LKP%20HReDU,%20saya%20ingin%20bertanya%20tentang%20kursus.";

export const normalizePhone = (p) => {
  let d = (p || "").replace(/\D/g, "");
  if (d.startsWith("0")) d = "62" + d.slice(1);
  else if (d.startsWith("8")) d = "62" + d;
  return d;
};

export const waLink = (phone, text) =>
  `https://wa.me/${normalizePhone(phone)}?text=${encodeURIComponent(text)}`;

export const GOOGLE_BUSINESS_URL = "https://share.google/DFJdNjc6LrlCem6hT";

export const HERO_IMAGE = "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200";

export const HERO_BG = "https://static.prod-images.emergentagent.com/jobs/d82c79aa-9b66-4a36-a046-9931c05092d4/images/de6216bbbf89858f2b214238a90d3a5774c2a028708d22e61ce18af92c68ec08.jpeg";

export const COURSES = [
  {
    id: "office-profesional",
    title: "Kursus Ms Office Profesional",
    image: "https://images.pexels.com/photos/1181378/pexels-photo-1181378.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Perkantoran & Administrasi",
    duration: "8x Pertemuan",
    price: "Rp 1.500.000",
    original_price: "Rp 1.800.000",
    badge: "Terpopuler",
    highlights: [
      "Ms Word Advanced (Mail Merge & Layout Dokumen)",
      "Ms Excel Dasar hingga Intermediate",
      "Ms PowerPoint Presentasi Memukau",
      "Sertifikat Kelulusan LKP HReDU",
    ],
  },
  {
    id: "mahir-excel",
    title: "Kursus Mahir Excel",
    image: "https://images.pexels.com/photos/8296982/pexels-photo-8296982.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Data & Accounting",
    duration: "8x Pertemuan",
    price: "Rp 1.600.000",
    original_price: "Rp 1.800.000",
    badge: "Best Seller",
    highlights: [
      "VLOOKUP, XLOOKUP, INDEX-MATCH",
      "Pivot Table & Interactive Dashboard",
      "Formula Kompleks & Data Validation",
      "Automation Macro VBA Dasar",
    ],
  },
  {
    id: "digital-marketing-bnsp",
    title: "Digital Marketing & Sertifikasi BNSP",
    image: "https://images.unsplash.com/photo-1724862936518-ae7fcfc052c1?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
    category: "Sertifikasi Profesi BNSP",
    duration: "2 Bulan + Uji Kompetensi BNSP",
    price: "Rp 650.000",
    original_price: "Rp 950.000",
    badge: "BNSP Certified",
    highlights: [
      "Meta & Google Ads Campaign Strategy",
      "Social Media Management & Copywriting",
      "SEO & Content Marketing Strategy",
      "Uji Kompetensi & Sertifikat BNSP",
    ],
  },
  {
    id: "pilihan-lainnya",
    title: "Program & Sertifikasi Lainnya",
    image: "https://images.pexels.com/photos/7648050/pexels-photo-7648050.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Custom & Corporate",
    duration: "Fleksibel / Sesuai Kebutuhan",
    price: "Hubungi Admin",
    original_price: null,
    badge: "Custom",
    highlights: [
      "Graphic Design & UI/UX Fundamentals",
      "HR Staff & Sertifikasi BNSP",
      "In-House Corporate Training",
      "Konsultasi Kurikulum Kampus/Perusahaan",
    ],
  },
];

export const BANKS = [
  { bank_name: "Bank BCA", account_number: "690-1044888", account_name: "PT. HREDU Global Mandiri" },
];
