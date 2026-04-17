import { MessageCircle } from "lucide-react";
import { WHATSAPP_LINK } from "@/lib/constants";

export const WhatsAppFloat = () => (
  <a
    href={WHATSAPP_LINK}
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-50 btn-whatsapp text-white p-4 rounded-full animate-pulse-ring glow-whatsapp shadow-2xl hover:scale-110 transition-transform"
    data-testid="whatsapp-float-btn"
  >
    <MessageCircle className="w-8 h-8" fill="white" />
  </a>
);
