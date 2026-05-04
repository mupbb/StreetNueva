import { WHATSAPP_LINK } from "@/lib/constants";
import { WhatsAppIcon } from "./shared";

export const WhatsAppFloat = () => (
  <a
    href={WHATSAPP_LINK}
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 btn-whatsapp text-white p-3 md:p-4 rounded-full animate-pulse-ring glow-whatsapp shadow-2xl hover:scale-110 transition-transform"
    data-testid="whatsapp-float-btn"
  >
    <WhatsAppIcon className="w-6 h-6 md:w-8 md:h-8" />
  </a>
);
