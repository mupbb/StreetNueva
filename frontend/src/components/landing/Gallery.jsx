import { motion } from "framer-motion";
import { Sparkles, ChevronRight } from "lucide-react";
import { WHATSAPP_NUMBER, fadeInUp, staggerContainer } from "@/lib/constants";
import { viewportOnce } from "./shared";
import { BeforeAfterSlider } from "./BeforeAfterSlider";

export const Gallery = () => {
  return (
    <section className="py-24 md:py-32 bg-black overflow-hidden" id="galeria" data-testid="gallery-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="mb-16 md:mb-24 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-[#1F6AE1]" />
              <span className="text-[#1F6AE1] font-bold tracking-[0.2em] text-xs md:text-sm uppercase">EVIDENCIA VISUAL</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-6 uppercase">
              RESULTADOS <span className="text-[#1F6AE1]">REALES</span>
            </h2>
            <p className="text-[#C9CDD3] max-w-2xl mx-auto font-medium text-lg">
              Desliza para ver la transformación profunda que realizamos en cada detalle.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="mb-20">
            <BeforeAfterSlider />
          </motion.div>

          <motion.div variants={fadeInUp} className="text-center">
            <a 
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola, vi sus resultados de Antes y Después en la galería y ¡Quiero mi auto así!")}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-4 bg-[#1F6AE1] text-white font-black px-12 py-6 rounded-2xl uppercase tracking-[0.2em] text-xl transition-all hover:scale-105 active:scale-95 glow-primary shadow-[0_0_30px_rgba(31,106,225,0.4)]" 
              data-testid="gallery-whatsapp-btn"
            >
              QUIERO MI AUTO ASÍ
              <ChevronRight className="w-6 h-6" />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
