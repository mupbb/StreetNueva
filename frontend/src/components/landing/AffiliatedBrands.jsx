import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/constants";
import { viewportOnce } from "./shared";

const AFFILIATED_BRANDS = [
  {
    name: "Meguiar's",
    svg: (
      <svg viewBox="0 0 200 50" className="h-10 w-auto">
        <defs>
          <linearGradient id="meguiars-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D4A017" />
            <stop offset="100%" stopColor="#FFD700" />
          </linearGradient>
        </defs>
        <text x="100" y="35" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="bold" fontSize="28" fill="url(#meguiars-grad)" letterSpacing="1">Meguiar's</text>
        <text x="100" y="48" textAnchor="middle" fontFamily="Georgia, serif" fontSize="8" fill="#B8860B" letterSpacing="3">SINCE 1901</text>
      </svg>
    )
  },
  {
    name: "Armor All",
    svg: (
      <svg viewBox="0 0 200 50" className="h-10 w-auto">
        <text x="100" y="33" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="26" fill="#4A90D9" letterSpacing="2">ARMOR</text>
        <text x="100" y="48" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="14" fill="#7BB3E0" letterSpacing="4">ALL</text>
      </svg>
    )
  },
  {
    name: "Turtle Wax",
    svg: (
      <svg viewBox="0 0 200 50" className="h-10 w-auto">
        <defs>
          <linearGradient id="turtle-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2E8B57" />
            <stop offset="100%" stopColor="#3CB371" />
          </linearGradient>
        </defs>
        <text x="100" y="30" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="22" fill="url(#turtle-grad)" letterSpacing="1">TURTLE WAX</text>
        <rect x="30" y="38" width="140" height="2" rx="1" fill="#3CB371" opacity="0.6" />
      </svg>
    )
  },
  {
    name: "Pro Elite",
    svg: (
      <svg viewBox="0 0 200 50" className="h-10 w-auto">
        <defs>
          <linearGradient id="proelite-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C0C0C0" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#C0C0C0" />
          </linearGradient>
        </defs>
        <text x="100" y="28" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="20" fill="url(#proelite-grad)" letterSpacing="4">PRO ELITE</text>
        <line x1="35" y1="35" x2="165" y2="35" stroke="#C0C0C0" strokeWidth="0.5" />
        <text x="100" y="46" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="8" fill="#A0A0A0" letterSpacing="5">DETAILING</text>
      </svg>
    )
  }
];

export const AffiliatedBrands = () => {
  return (
    <section className="py-8 md:py-10 overflow-hidden" data-testid="affiliated-brands-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Sparkles className="w-5 h-5 text-[#1F6AE1]" />
              <span className="text-[#1F6AE1] font-semibold tracking-wider text-sm">CALIDAD GARANTIZADA</span>
              <Sparkles className="w-5 h-5 text-[#1F6AE1]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Productos <span className="text-[#1F6AE1]">Afiliados</span>
            </h2>
          </motion.div>

          <motion.div variants={fadeInUp} className="brand-carousel-wrapper">
            <div className="brand-carousel-track">
              {[...AFFILIATED_BRANDS, ...AFFILIATED_BRANDS, ...AFFILIATED_BRANDS].map((brand, index) => (
                <div
                  key={`${brand.name}-${index}`}
                  className="brand-carousel-item glass-card rounded-2xl px-8 py-5 flex items-center justify-center min-w-[220px] mx-3 hover:border-[#1F6AE1]/30 border border-white/5 transition-all duration-300"
                  data-testid={`brand-${brand.name.toLowerCase().replace(/['\s]/g, '-')}`}
                >
                  <div className="opacity-70 hover:opacity-100 transition-opacity duration-300">
                    {brand.svg}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
