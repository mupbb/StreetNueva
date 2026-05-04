import { Phone } from "lucide-react";
import { IMAGES, WHATSAPP_LINK, WHATSAPP_NUMBER, fadeInUp, staggerContainer } from "../../lib/constants";
import { WhatsAppIcon } from "./shared";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-end overflow-hidden pt-20" data-testid="hero-section">
      <div className="absolute inset-0 z-0 bg-black">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="w-full h-full object-cover opacity-60"
        >
          <source src="/assets/landing/hero-video.mp4" type="video/mp4" />
        </video>
        {/* Subtle overlay to enhance text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-20 md:pb-24">
        <div className="max-w-4xl">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-[2px] bg-[#1F6AE1]" />
            <p className="text-[#1F6AE1] font-bold tracking-[0.2em] text-xs md:text-sm uppercase">
              Street Prime Detail
            </p>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-extrabold text-white leading-[0.9] mb-8 uppercase">
            DETALLADO DE AUTOS <br />
            A DOMICILIO <br />
            <span className="text-[#1F6AE1]">EN EL CDMX • PONIENTE</span>
          </h1>
          
          <p className="text-base md:text-lg text-[#C9CDD3] mb-10 max-w-xl font-medium leading-relaxed">
            Limpieza profesional, puntual y sin que salgas de casa. Tu auto como nuevo, donde estés.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <a
              href="#pricing-section"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#1F6AE1] hover:bg-[#1C5FCB] text-white font-bold px-10 py-4 rounded-full uppercase tracking-wider transition-all hover:scale-105 shadow-[0_0_20px_rgba(31,106,225,0.4)]"
              data-testid="hero-pricing-btn"
            >
              Ver precios y paquetes
              <div className="w-5 h-5 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </div>
            </a>
            
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 border border-white/20 hover:border-[#1F6AE1]/50 text-white font-bold px-10 py-4 rounded-full uppercase tracking-wider transition-all hover:scale-105 bg-black/20 backdrop-blur-sm"
              data-testid="hero-whatsapp-btn"
            >
              <WhatsAppIcon className="w-5 h-5" />
              Agendar ahora
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}