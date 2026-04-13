import { motion } from "framer-motion";
import { Clock, Shield, CheckCircle2, Star, ChevronRight } from "lucide-react";
import { IMAGES, fadeInUp, staggerContainer } from "@/lib/constants";
import { hoverSlideRight, viewportOnce } from "./shared";

const REASONS = [
  { id: "tiempo", icon: Clock, text: "No pierdes tiempo ni te trasladas" },
  { id: "cuidado", icon: Shield, text: "Cuidado real del vehículo" },
  { id: "profesional", icon: CheckCircle2, text: "Puntualidad y trato profesional" },
  { id: "resultados", icon: Star, text: "Resultados visibles desde el primer servicio" }
];

export const WhyChooseUs = () => (
  <section className="py-6 md:py-8 relative overflow-hidden" data-testid="why-us-section">
    <div className="absolute inset-0 z-0">
      <img src={IMAGES.whyUs} alt="Por qué elegirnos" className="w-full h-full object-cover opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0D10] via-[#0B0D10]/90 to-[#0B0D10]" />
    </div>

    <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
      <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={staggerContainer}>
        <motion.div variants={fadeInUp} className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Star className="w-6 h-6 text-[#1F6AE1]" />
            <span className="text-[#1F6AE1] font-semibold tracking-wider text-sm">¿POR QUÉ ELEGIRNOS?</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            ¿Por qué elegir <span className="text-[#1F6AE1]">Street Prime Detail</span>?
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {REASONS.map((reason) => (
            <motion.div key={reason.id} variants={fadeInUp} className="glass-card p-6 rounded-2xl flex items-center gap-4 group hover:border-[#1F6AE1]/50 transition-colors" whileHover={hoverSlideRight} data-testid={`reason-card-${reason.id}`}>
              <div className="benefit-icon p-4 rounded-xl transition-colors group-hover:bg-[#1F6AE1]/20">
                <reason.icon className="w-6 h-6 text-[#1F6AE1]" />
              </div>
              <span className="text-lg text-white font-medium">{reason.text}</span>
            </motion.div>
          ))}
        </div>

        <motion.div variants={fadeInUp} className="text-center">
          <a href="#pricing-section" className="inline-flex items-center gap-2 btn-primary text-white font-bold px-8 py-4 rounded-full uppercase tracking-wider transition-transform hover:scale-105 active:scale-95" data-testid="why-us-cta-btn">
            Ver precios y paquetes
            <ChevronRight className="w-5 h-5" />
          </a>
        </motion.div>
      </motion.div>
    </div>
  </section>
);
