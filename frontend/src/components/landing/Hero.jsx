import { motion, useScroll, useTransform } from "framer-motion";
import { MessageCircle, Phone } from "lucide-react";
import { IMAGES, WHATSAPP_LINK, WHATSAPP_NUMBER, fadeInUp, staggerContainer } from "@/lib/constants";

export const Hero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-end overflow-hidden pt-20" data-testid="hero-section">
      <motion.div className="absolute inset-0 z-0" style={{ y }}>
        <div className="absolute inset-0 bg-black" />
        <img 
          src={IMAGES.hero} 
          alt="Acabado espejo en pintura de auto de lujo tras detallado automotriz profesional por Street Prime Detail"
          className="w-full h-full object-cover opacity-20 md:opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent" />
      </motion.div>

      <motion.div 
        className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-20 md:pb-24"
        style={{ opacity }}
      >
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-4xl">
          <motion.div variants={fadeInUp} className="flex items-center gap-2 mb-6">
            <div className="w-10 h-[2px] bg-[#1F6AE1]" />
            <p className="text-[#1F6AE1] font-bold tracking-[0.2em] text-xs md:text-sm uppercase">
              Street Prime Detail
            </p>
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="text-5xl sm:text-6xl lg:text-8xl font-extrabold text-white leading-[0.9] mb-8 uppercase">
            DETALLADO DE AUTOS <br />
            A DOMICILIO <br />
            <span className="text-[#1F6AE1]">EN CDMX</span>
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-base md:text-lg text-[#C9CDD3] mb-10 max-w-xl font-medium leading-relaxed">
            Limpieza profesional, puntual y sin que salgas de casa. Tu auto como nuevo, donde estés.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-6">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 btn-whatsapp text-white font-bold px-8 py-4 rounded-full uppercase tracking-wider transition-all hover:scale-105 glow-whatsapp"
              data-testid="hero-whatsapp-btn"
            >
              <MessageCircle className="w-5 h-5" />
              Agendar ahora
            </a>
            <a
              href={`tel:${WHATSAPP_NUMBER}`}
              className="inline-flex items-center gap-2 text-[#C9CDD3] font-bold hover:text-white transition-colors"
              data-testid="hero-phone-link"
            >
              <Phone className="w-5 h-5 text-[#1F6AE1]" />
              {WHATSAPP_NUMBER}
            </a>
          </motion.div>
        </motion.div>
      </motion.div>

    </section>
  );
};
