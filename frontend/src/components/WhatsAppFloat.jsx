import { WA_LINK } from "@/data";
import { MessageCircle } from "lucide-react";

export const WhatsAppFloat = () => (
  <a
    data-testid="contact-wa-button"
    href={WA_LINK}
    target="_blank"
    rel="noreferrer"
    className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold pl-4 pr-5 py-3.5 rounded-full shadow-xl shadow-green-500/30 transition-all hover:scale-105"
  >
    <MessageCircle className="h-5 w-5" />
    <span className="hidden sm:inline text-sm">Chat Admin</span>
  </a>
);
