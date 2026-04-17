import { Car, Sparkles, Star, Home, Droplets } from "lucide-react";
import { IMAGES, fadeInUp, staggerContainer } from "@/lib/constants";
import { hoverLiftSmall, viewportOnce } from "./shared";

const SERVICES = [
  { id: "exterior", title: "Lavado Exterior Profesional", description: "Eliminamos suciedad, polvo y contaminantes sin dañar la pintura.", icon: Droplets, image: IMAGES.service1, altText: "Servicio de Detallado Exterior Profesional - Lavado a mano y Descontaminación de Pintura por Street Prime Detail" },
  { id: "interior", title: "Limpieza Interior Profunda", description: "Aspirado, limpieza de tapicería, plásticos, tablero y detalles.", icon: Sparkles, image: IMAGES.service2, altText: "Limpieza Profunda de Interiores de Automóviles - Desinfección de Vestiduras y Tablero en CDMX" },
  { id: "premium", title: "Detallado Automotriz Premium", description: "Cuidado minucioso para interiores y exteriores. Ideal para autos exigentes.", icon: Star, image: IMAGES.service3, altText: "Tratamiento de Detallado Automotriz Premium y Protección con Cera de Alta Gama para Vehículos de Lujo" },
  { id: "domicilio", title: "Servicio 100% a Domicilio", description: "Vamos a tu casa, oficina o ubicación dentro de nuestra zona de cobertura.", icon: Home, image: IMAGES.whyUs, altText: "Servicio de Car Wash y Detailing a Domicilio - Street Prime Detail atendiendo en la puerta de tu casa" }
];

export const Services = () => (
  <section className="py-16 md:py-24" data-testid="services-section">
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      <div>
        <div className="mb-12 md:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Car className="w-6 h-6 text-[#1F6AE1]" />
            <span className="text-[#1F6AE1] font-bold tracking-[0.2em] text-xs md:text-sm uppercase">NUESTROS SERVICIOS</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">
            SERVICIOS DE <br />
            <span className="text-[#1F6AE1]">DETALLADO</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service) => (
            <div
              key={service.id}

              className="service-card glass-card rounded-3xl overflow-hidden group cursor-pointer transition-all duration-500 hover:border-[#1F6AE1]/50 hover:-translate-y-2"
              data-testid={`service-card-${service.id}`}
            >
              <div className="relative h-56 overflow-hidden">
                {/* Placeholder image background - user will provide real ones */}
                <div className="absolute inset-0 bg-black/20 transition-transform duration-700 group-hover:scale-110" />
                <img 
                  src={service.image} 
                  alt={service.altText} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              </div>
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-[#1F6AE1]/10 border border-[#1F6AE1]/20">
                    <service.icon className="w-5 h-5 text-[#1F6AE1]" />
                  </div>
                  <h3 className="text-xl font-bold text-white leading-tight tracking-tight uppercase">{service.title}</h3>
                </div>
                <p className="text-[#C9CDD3] text-sm leading-relaxed font-medium">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);
