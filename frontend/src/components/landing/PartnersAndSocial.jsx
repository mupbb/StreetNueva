import { motion } from "framer-motion";
import { PARTNER_BRANDS, SOCIAL_LINKS, fadeInUp, staggerContainer } from "@/lib/constants";
import { viewportOnce } from "./shared";
import { Sparkles, Share2 } from "lucide-react";

export const PartnersAndSocial = () => {
  return (
    <div className="bg-black">
      {/* Section 1: Productos Afiliados (Carousel) */}
      <section className="py-24 border-t border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={staggerContainer}>
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sparkles className="w-5 h-5 text-[#1F6AE1]" />
              <span className="text-[#1F6AE1] font-bold tracking-[0.2em] text-xs md:text-sm uppercase">CALIDAD GARANTIZADA</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
              PRODUCTOS <span className="text-[#1F6AE1]">AFILIADOS</span>
            </h2>
          </motion.div>
        </div>

        {/* Infinite Scrolling Marquee */}
        <div className="relative flex overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap gap-12 md:gap-24 py-4">
            {[...PARTNER_BRANDS, ...PARTNER_BRANDS, ...PARTNER_BRANDS].map((brand, idx) => (
              <div 
                key={`${brand.id}-${idx}`} 
                className="w-48 md:w-64 h-24 md:h-32 glass-card flex items-center justify-center p-6 md:p-10 grayscale hover:grayscale-0 transition-all duration-500 rounded-3xl border border-white/5"
              >
                <img src={brand.logo} alt={`Logo oficial de ${brand.name} - Productos de calidad utilizados por Street Prime Detail`} className="max-w-full max-h-full object-contain pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Nuestras Redes Sociales */}
      <section className="py-24 border-t border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={staggerContainer} className="mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Share2 className="w-5 h-5 text-[#1F6AE1]" />
              <span className="text-[#1F6AE1] font-bold tracking-[0.2em] text-xs md:text-sm uppercase">SÍGUENOS</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
              NUESTRAS <span className="text-[#1F6AE1]">REDES SOCIALES</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {SOCIAL_LINKS.map((link) => (
              <motion.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -8, scale: 1.05 }}
                className="glass-card p-8 rounded-[2rem] flex flex-col items-center gap-4 border border-white/10 hover:border-[#1F6AE1]/50 group transition-all"
                data-testid={`social-${link.id}`}
              >
                <div className="w-12 h-12 flex items-center justify-center p-1 group-hover:drop-shadow-[0_0_15px_rgba(31,106,225,0.4)] transition-all">
                  <img src={link.icon} alt={`Síguenos en ${link.name} de Street Prime Detail`} className="w-full h-full object-contain brightness-0 invert opacity-60 group-hover:opacity-100 transition-all" />
                </div>
                <span className="text-white font-bold uppercase tracking-widest text-xs opacity-60 group-hover:opacity-100">{link.name}</span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
