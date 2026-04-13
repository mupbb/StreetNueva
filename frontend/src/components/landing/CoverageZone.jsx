import { motion } from "framer-motion";
import { MapPin, Clock } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/constants";
import { viewportOnce } from "./shared";

const ZONES = [
  'Álvaro Obregón', 'Santa Fe', 'San Ángel', 'Coyoacán', 'CDMX Centro', 'Interlomas',
  'Bosques de las Lomas', 'Bosque Real', 'Polanco', 'Condesa', 'Roma', 'Del Valle'
];

const IFRAME_STYLE = { border: 0, borderRadius: '1rem' };

export const CoverageZone = () => (
  <section className="py-6 md:py-8" data-testid="coverage-section">
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={staggerContainer}>
        <motion.div variants={fadeInUp} className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-6 h-6 text-[#1F6AE1]" />
            <span className="text-[#1F6AE1] font-semibold tracking-wider text-sm">ZONA DE COBERTURA</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Atendemos en <span className="text-[#1F6AE1]">CDMX</span>
          </h2>
          <p className="text-[#94A3B8] text-lg max-w-xl">
            Servicio a domicilio en Álvaro Obregón y zonas cercanas de la Ciudad de México.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={fadeInUp} className="relative w-full h-[400px] md:h-[450px] rounded-2xl overflow-hidden glass-card">
            <iframe
              src="https://storage.googleapis.com/maps-solutions-xw50v1uv8z/locator-plus/5vx4/locator-plus.html"
              width="100%" height="100%"
              style={IFRAME_STYLE}
              loading="lazy"
              title="Street Prime Detail - Ubicación"
              allowFullScreen
            />
          </motion.div>

          <motion.div variants={fadeInUp} className="space-y-6">
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="benefit-icon p-3 rounded-xl"><MapPin className="w-6 h-6 text-[#1F6AE1]" /></div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Dirección Base</h3>
                  <p className="text-[#94A3B8] mb-4">Prol. San Diego 110B, San Bartolo Ameyalco,<br />Álvaro Obregón, CDMX</p>
                  
                  <div className="flex gap-4">
                    <a 
                      href={GOOGLE_MAPS_LINK} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-white/5 hover:bg-[#4285F4]/20 border border-white/10 hover:border-[#4285F4]/50 px-4 py-2 rounded-xl transition-all group"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#4285F4"/>
                      </svg>
                      <span className="text-xs font-bold text-white uppercase tracking-wider">Google Maps</span>
                    </a>
                    
                    <a 
                      href={WAZE_LINK} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-white/5 hover:bg-[#33CCFF]/20 border border-white/10 hover:border-[#33CCFF]/50 px-4 py-2 rounded-xl transition-all group"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.156 12.336c-.524 0-.948.424-.948.948 0 .524.424.948.948.948h.04c.524 0 .948-.424.948-.948 0-.524-.424-.948-.948-.948h-.04zm-4.704 0c-.524 0-.948.424-.948.948 0 .524.424.948.948.948h.04c.524 0 .948-.424.948-.948 0-.524-.424-.948-.948-.948h-.04zm-1.8 4.793c1.78-.344 3.016-1.572 3.54-3.52.02.008.04.016.06.016 1.408 0 2.548-1.144 2.548-2.544 0-.464-.132-.892-.34-1.26a5.552 5.552 0 0 0 .584-2.484c0-3.08-2.504-5.58-5.58-5.58-2.572 0-4.744 1.748-5.388 4.12A5.564 5.564 0 0 0 3.732 9.1c0 2.392 1.488 4.436 3.58 5.232-.012.1-.016.196-.016.292 0 2.228 1.836 4.04 4.092 4.04.424 0 .824-.072 1.252-.252.004.148.044.28.16.324a.512.512 0 0 0 .64-.208c.112-.176.084-.404-.008-.552-.008-.016-.016-.032-.024-.048l-.004-.028-.004-.032z"/>
                      </svg>
                      <span className="text-xs font-bold text-white uppercase tracking-wider">Waze</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="benefit-icon p-3 rounded-xl"><Clock className="w-6 h-6 text-[#1F6AE1]" /></div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Horario de Atención</h3>
                  <p className="text-[#94A3B8]">Abre a las 10:00 a.m.</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-white mb-3">Zonas Principales</h3>
              <div className="flex flex-wrap gap-2">
                {ZONES.map((zone) => (
                  <span key={zone} className="px-3 py-1 bg-[#1F6AE1]/10 border border-[#1F6AE1]/30 rounded-full text-sm text-[#C9CDD3]">{zone}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  </section>
);
