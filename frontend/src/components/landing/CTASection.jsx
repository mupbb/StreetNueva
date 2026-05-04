import { Phone } from "lucide-react";
import { IMAGES, WHATSAPP_LINK, WHATSAPP_NUMBER } from "@/lib/constants";
import { viewportOnce, WhatsAppIcon } from "./shared";

export const CTASection = () => (
  <section className="py-24 md:py-32 bg-black overflow-hidden" data-testid="cta-section">
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      <div

        className="relative glass-card p-12 md:p-24 rounded-[3rem] text-center border-t border-white/10 glow-primary"
      >
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <img src={IMAGES.hero} alt="" className="w-full h-full object-cover grayscale" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        </div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#25D366]/10 border border-[#25D366]/20 px-4 py-2 rounded-full mb-8">
            <div className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
            <span className="text-[#25D366] text-xs font-bold uppercase tracking-widest">Atención Inmediata disponible</span>
          </div>
          
          <h2 className="text-5xl md:text-8xl font-black text-white mb-8 leading-tight">
            ¿LISTO PARA <br />
            <span className="text-[#1F6AE1]">ESTRENAR</span> AUTO?
          </h2>
          
          <p className="text-xl md:text-2xl text-[#C9CDD3] mb-12 max-w-2xl mx-auto font-medium">
            Recupera el brillo de agencia y protege tu inversión hoy mismo. El servicio más premium de la CDMX, directo a tu puerta.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a 
              href={WHATSAPP_LINK} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group relative inline-flex items-center gap-4 btn-whatsapp text-white font-black px-12 py-6 rounded-2xl uppercase tracking-[0.1em] transition-all hover:scale-105 hover:translate-y-[-4px] active:scale-95 text-xl glow-whatsapp" 
              data-testid="cta-whatsapp-btn"
            >
              <WhatsAppIcon className="w-7 h-7" />
              Agendar por WhatsApp
              <div className="absolute -inset-1 opacity-0 group-hover:opacity-30 transition-opacity bg-white/20 blur-md rounded-2xl" />
            </a>
            
            <div className="flex flex-col items-center sm:items-start gap-1">
              <p className="text-[#94A3B8] text-xs font-bold uppercase tracking-widest pl-1">Llámanos directo</p>
              <a href={`tel:${WHATSAPP_NUMBER}`} className="inline-flex items-center gap-3 text-white font-extrabold text-2xl hover:text-[#1F6AE1] transition-colors" data-testid="cta-phone-link">
                <Phone className="w-6 h-6 text-[#1F6AE1]" />
                55 7250 2791
              </a>
            </div>
          </div>
          
          <div className="mt-16 flex flex-wrap justify-center gap-6 md:gap-12 opacity-60">
            <div className="flex items-center gap-2 text-white/70 text-sm font-bold uppercase tracking-widest">
              <div className="w-1 h-1 rounded-full bg-[#1F6AE1]" />
              Garantía de Satisfacción
            </div>
            <div className="flex items-center gap-2 text-white/70 text-sm font-bold uppercase tracking-widest">
              <div className="w-1 h-1 rounded-full bg-[#1F6AE1]" />
              Personal Capacitado
            </div>
            <div className="flex items-center gap-2 text-white/70 text-sm font-bold uppercase tracking-widest">
              <div className="w-1 h-1 rounded-full bg-[#1F6AE1]" />
              Insumos de Lujo
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);