import { IMAGES, WHATSAPP_LINK } from "@/lib/constants";
import { WhatsAppIcon } from "./shared";

export const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-40 glass-header">
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
      <a href="#" className="flex items-center">
        <img src={IMAGES.logo} alt="Street Prime Detail - Logotipo Oficial Detallado Automotriz Premium en CDMX" className="h-8 md:h-12 lg:h-14 transition-all" />
      </a>
      <div className="flex items-center gap-2 md:gap-8">
        <a href="#/tips" className="text-[#94A3B8] hover:text-white font-medium text-[10px] md:text-sm transition-colors uppercase tracking-[0.15em] md:tracking-widest">Tips & Blog</a>
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 md:gap-2 btn-whatsapp text-white font-bold px-3 py-2 md:px-5 md:py-2.5 rounded-full text-[10px] md:text-sm uppercase tracking-wider transition-all hover:scale-105 glow-whatsapp"
          data-testid="nav-whatsapp-btn"
        >
          <WhatsAppIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
          Agenda ahora
        </a>
      </div>
    </div>
  </nav>
);
