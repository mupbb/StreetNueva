import { Check, Shield, Zap, Star, MessageCircle } from "lucide-react";
import { CARE_PLANS, WHATSAPP_NUMBER, fadeInUp, staggerContainer } from "@/lib/constants";
import { viewportOnce } from "./shared";

const buildCarePlanMessage = (planName) => {
  const msg = `Hola, me interesa solicitar el plan de cuidado: *${planName}*.\n\nPor favor, contáctenme para la activación.`;
  return encodeURIComponent(msg);
};

export const CarePlans = () => {
  return (
    <section className="py-20 md:py-32 bg-black overflow-hidden" id="planes">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div>
          <div className="mb-16 md:mb-24 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-[#1F6AE1]" />
              <span className="text-[#1F6AE1] font-bold tracking-[0.2em] text-xs md:text-sm uppercase">RETENCIÓN Y RECURRENCIA</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-6">
              PLANES DE <span className="text-[#1F6AE1]">CUIDADO</span>
            </h2>
            <p className="text-[#C9CDD3] max-w-2xl mx-auto font-medium text-lg">
              Mantén el brillo y la protección de tu vehículo de forma regular con nuestros planes exclusivos. Sin suscripciones automáticas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {CARE_PLANS.map((plan, index) => (
              <div
                key={plan.id}

                className="relative group h-full"
              >
                {/* Glow Background */}
                <div 
                  className="absolute -inset-4 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-2xl rounded-[3rem]"
                  style={{ backgroundColor: plan.accent }}
                />
                
                <div className="relative glass-card h-full rounded-[2.5rem] p-8 md:p-10 flex flex-col border-t-2 border-white/10 group-hover:border-white/20 transition-colors overflow-hidden">
                  {/* Watermark Background */}
                  <img 
                    src="/assets/landing/card-watermark.png" 
                    alt="" 
                    className="absolute inset-0 w-full h-full object-cover opacity-[0.05] grayscale pointer-events-none"
                  />
                  
                  <div className="relative z-10 flex flex-col h-full">
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      {index === 0 && <Zap className="w-5 h-5" style={{ color: plan.accent }} />}
                      {index === 1 && <Star className="w-5 h-5" style={{ color: plan.accent }} />}
                      {index === 2 && <Shield className="w-5 h-5" style={{ color: plan.accent }} />}
                      <span className="text-xs font-bold tracking-widest uppercase" style={{ color: plan.accent }}>
                        {index === 2 ? 'PLAN PREMIUM' : 'PLAN POPULAR'}
                      </span>
                    </div>
                    <h3 className="text-2xl font-extrabold text-white leading-tight mb-4">{plan.name}</h3>
                    <div className="flex items-baseline gap-2 mb-6">
                      <span className="text-4xl font-extrabold text-white">${plan.price.toLocaleString()}</span>
                      <span className="text-[#94A3B8] font-bold text-sm">MXN / PERIODO</span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-10 flex-grow">
                    {plan.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="mt-1 p-0.5 rounded-full bg-white/5 border border-white/10">
                          <Check className="w-3.5 h-3.5" style={{ color: plan.accent }} />
                        </div>
                        <span className="text-[#C9CDD3] text-sm md:text-base font-medium leading-tight">{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${buildCarePlanMessage(plan.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-3 py-4 rounded-2xl text-white font-extrabold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 glow-primary"
                    style={{ backgroundColor: plan.accent === '#FFFFFF' ? '#1F6AE1' : plan.accent, boxShadow: `0 0 20px ${plan.accent}40` }}
                  >
                    <MessageCircle className="w-5 h-5" />
                    Solicitar plan
                  </a>
                  
                  <p className="mt-4 text-center text-[#94A3B8] text-[10px] uppercase tracking-widest font-bold">
                    Activación manual · Pago directo
                  </p>
                </div>
              </div>
            </div>
          ))}
          </div>

          <div className="mt-20 text-center">
            <div className="inline-block glass-card px-8 py-6 rounded-3xl border border-white/5 max-w-2xl mx-auto">
              <p className="text-[#C9CDD3] text-sm md:text-base font-medium italic">
                "El mantenimiento regular es la clave para preservar el valor y la estética de tu inversión. Nuestros planes están diseñados para simplificar tu vida."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};