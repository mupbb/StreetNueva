import { Home, Sparkles, Heart, Shield } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/constants";
import { viewportOnce } from "./shared";

const BADGES = [
  { id: "domicilio", icon: Home, text: "Servicio profesional a domicilio" },
  { id: "premium", icon: Sparkles, text: "Productos premium" },
  { id: "atencion", icon: Heart, text: "Atención personalizada" },
  { id: "lgbtq", icon: Shield, text: "Amigable con LGBTQ+" }
];

export const TrustBadges = () => (
  <section className="py-6 md:py-8 border-y border-white/5 bg-white/[0.02]" data-testid="trust-section">
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-4"




      >
        {BADGES.map((badge) => (
          <div
            key={badge.id}

            className="flex items-center gap-4 group justify-center lg:justify-start"
            data-testid={`trust-badge-${badge.id}`}
          >
            <div className="p-3 rounded-2xl bg-[#1F6AE1]/10 border border-[#1F6AE1]/20 group-hover:scale-110 transition-transform duration-500">
              <badge.icon className="w-5 h-5 text-[#1F6AE1]" />
            </div>
            <span className="text-sm md:text-base text-[#C9CDD3] font-bold uppercase tracking-wider">
              {badge.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  </section>
);
