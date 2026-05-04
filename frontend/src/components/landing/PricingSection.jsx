import { useState, useCallback, useMemo } from "react";
import { 
  Calculator, CheckCircle2, Check, Plus, 
  Car, Truck, Sparkles, ShieldCheck, Droplets, Info, Wrench, Bitcoin
} from "lucide-react";
import { VEHICLE_TYPES, PACKAGES, UPSELLS, WHATSAPP_NUMBER, CRYPTO, fadeInUp, staggerContainer } from "@/lib/constants";
import { CryptoModal } from "./CryptoModal";
import { hoverLiftSmall, revealIn, revealVisible, viewportOnce, WhatsAppIcon } from "./shared";
import { trackUserAction } from "@/lib/apiUtils";

const GET_ICON = (iconId) => {
  const props = { className: "w-5 h-5" };
  switch (iconId) {
    // Vehicles
    case 'car-sm': return <Car {...props} size={18} />;
    case 'car-md': return <Car {...props} size={22} />;
    case 'car-lg': return <Car {...props} size={26} />;
    case 'suv-sm': return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
        <circle cx="7" cy="17" r="2" />
        <path d="M9 17h6" />
        <circle cx="17" cy="17" r="2" />
      </svg>
    );
    case 'suv-lg': return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
        <circle cx="7" cy="17" r="2" />
        <path d="M9 17h6" />
        <circle cx="17" cy="17" r="2" />
      </svg>
    );
    case 'truck-lg': return <Truck {...props} />;
    case 'truck-xl': return <Truck className="w-6 h-6" />;
    
    // Upsells
    case 'interior': return <Sparkles {...props} />;
    case 'polish': return <Sparkles {...props} className="w-5 h-5 text-yellow-400" />;
    case 'ceramic': return <ShieldCheck {...props} />;
    case 'glass': return <Droplets {...props} />;
    case 'tires': return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="3" />
        <line x1="12" y1="2" x2="12" y2="22" />
        <line x1="2" y1="12" x2="22" y2="12" />
      </svg>
    );
    case 'engine': return <Wrench {...props} />;
    default: return <Info {...props} />;
  }
};

const VehicleSelector = ({ selected, onSelect }) => (
  <div className="mb-6">
    <h3 className="text-lg font-bold text-white mb-3 text-center">1. Selecciona tu vehículo</h3>
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 max-w-5xl mx-auto">
      {VEHICLE_TYPES.map((vehicle) => (
        <button
          key={vehicle.id}
          onClick={() => onSelect(vehicle.id)}
          className={`flex flex-col items-center justify-center p-3 rounded-xl font-medium transition-all group ${
            selected === vehicle.id
              ? 'bg-[#1F6AE1] text-white shadow-[0_0_20px_rgba(31,106,225,0.4)]'
              : 'glass-card text-[#C9CDD3] hover:border-[#1F6AE1]/50'
          }`}
          data-testid={`vehicle-${vehicle.id}`}
        >
          <div className={`mb-1 md:mb-2 transition-transform duration-300 group-hover:scale-110 ${selected === vehicle.id ? 'text-white' : 'text-[#1F6AE1]'}`}>
            {GET_ICON(vehicle.icon)}
          </div>
          <span className="text-[9px] sm:text-xs uppercase tracking-tighter sm:tracking-normal whitespace-nowrap overflow-hidden text-ellipsis w-full text-center leading-none">
            {vehicle.name}
          </span>
        </button>
      ))}
    </div>
  </div>
);

const PackageCard = ({ pkg, vehicleId, isSelected, onSelect }) => (
  <div
    onClick={() => onSelect(pkg.id)}
    className={`relative cursor-pointer rounded-2xl overflow-hidden transition-all ${
      isSelected ? 'ring-2 ring-offset-2 ring-offset-[#0B0D10]' : ''
    }`}
    style={{ borderColor: isSelected ? pkg.color : 'transparent', ringColor: pkg.color }}
    data-testid={`package-${pkg.id}`}
  >
    {/* Watermark Background */}
    <img 
      src="/assets/landing/card-watermark.png" 
      alt="" 
      className="absolute inset-0 w-full h-full object-cover opacity-[0.05] grayscale pointer-events-none"
    />

    <div className="relative z-10 h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img src={pkg.image} alt={pkg.altText || pkg.name} className="w-full h-full object-cover" />
        {isSelected && (
          <div className="absolute top-4 right-4 bg-white text-[#0B0D10] p-2 rounded-full shadow-lg">
            <Check className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="glass-card p-6 flex-grow" style={{ borderTopColor: pkg.color, borderTopWidth: '3px' }}>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xl font-bold text-white">{pkg.name}</h4>
          <span className="text-2xl font-bold" style={{ color: pkg.color }}>
            ${pkg.prices[vehicleId].toLocaleString()}
          </span>
        </div>
        <p className="text-[#94A3B8] text-sm mb-4">{pkg.subtitle}</p>
        <ul className="space-y-2">
          {pkg.features.map((feature) => (
            <li key={`${pkg.id}-${feature}`} className="flex items-center gap-2 text-sm text-[#C9CDD3]">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: pkg.color }} />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

const UpsellButton = ({ upsell, vehicleId, isSelected, onToggle }) => (
  <button
    onClick={() => onToggle(upsell.id)}
    className={`p-4 rounded-xl text-left transition-all flex items-center justify-between ${
      isSelected ? 'bg-[#1F6AE1]/20 border-2 border-[#1F6AE1]' : 'glass-card hover:border-[#1F6AE1]/50'
    }`}
    data-testid={`upsell-${upsell.id}`}
  >
    <div className="flex items-center gap-3">
      <div className={`${isSelected ? 'text-[#1F6AE1]' : 'text-[#94A3B8]'} transition-colors`}>
        {GET_ICON(upsell.icon)}
      </div>
      <div>
        <p className="font-medium text-white text-sm">{upsell.name}</p>
        <p className="text-[#1F6AE1] font-bold">+${upsell.prices[vehicleId].toLocaleString()} MXN</p>
      </div>
    </div>
    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
      isSelected ? 'bg-[#1F6AE1] text-white' : 'border border-[#94A3B8]'
    }`}>
      {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4 text-[#94A3B8]" />}
    </div>
  </button>
);

const buildWhatsAppMessage = (vehicleId, packageId, upsellIds, total) => {
  const vehicle = VEHICLE_TYPES.find(v => v.id === vehicleId);
  const pkg = PACKAGES.find(p => p.id === packageId);
  let message = `Hola, me interesa cotizar:\n\n`;
  message += `🚗 Vehículo: ${vehicle?.name}\n`;
  if (pkg) message += `📦 Paquete: ${pkg.name} - $${pkg.prices[vehicleId].toLocaleString()} MXN\n`;
  if (upsellIds.length > 0) {
    message += `\n➕ Servicios adicionales:\n`;
    upsellIds.forEach(id => {
      const u = UPSELLS.find(x => x.id === id);
      if (u) message += `• ${u.name} - $${u.prices[vehicleId].toLocaleString()} MXN\n`;
    });
  }
  message += `\n💰 Total estimado: $${total.toLocaleString()} MXN`;
  return encodeURIComponent(message);
};

export const PricingSection = () => {
  const [selectedVehicle, setSelectedVehicle] = useState('auto_mediano');
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedUpsells, setSelectedUpsells] = useState([]);
  const [isCryptoOpen, setIsCryptoOpen] = useState(false);

  const toggleUpsell = useCallback((upsellId) => {
    setSelectedUpsells(prev => {
      const next = prev.includes(upsellId) ? prev.filter(id => id !== upsellId) : [...prev, upsellId];
      return next;
    });
  }, []);

  const handlePackageSelect = useCallback((pkgId) => {
    setSelectedPackage(pkgId);
    const pkg = PACKAGES.find(p => p.id === pkgId);
    if (pkg) {
      trackUserAction('SelectPackage', { name: pkg.name, price: pkg.prices[selectedVehicle] });
    }
  }, [selectedVehicle]);

  const total = useMemo(() => {
    let sum = 0;
    if (selectedPackage) {
      const pkg = PACKAGES.find(p => p.id === selectedPackage);
      if (pkg) sum += pkg.prices[selectedVehicle];
    }
    selectedUpsells.forEach(id => {
      const u = UPSELLS.find(x => x.id === id);
      if (u) sum += u.prices[selectedVehicle];
    });
    return sum;
  }, [selectedPackage, selectedVehicle, selectedUpsells]);

  const handleCTAClick = useCallback((type) => {
    trackUserAction('InitiatePayment', { price: total, type });
  }, [total]);

  return (
    <section className="py-16 md:py-24 bg-black" id="pricing-section" data-testid="pricing-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div>
          <div className="mb-12 md:mb-16 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Calculator className="w-6 h-6 text-[#1F6AE1]" />
              <span className="text-[#1F6AE1] font-bold tracking-[0.2em] text-xs md:text-sm uppercase">COTIZA TU SERVICIO</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-6">
              NUESTROS <span className="text-[#1F6AE1]">PAQUETES</span>
            </h2>
            <p className="text-[#C9CDD3] max-w-2xl mx-auto font-medium">
              Selecciona tu tipo de vehículo, elige un paquete y agrega servicios adicionales para obtener tu cotización.
            </p>
          </div>

          <VehicleSelector selected={selectedVehicle} onSelect={setSelectedVehicle} />

          <div className="mb-12">
            <h3 className="text-xl font-bold text-white mb-8 text-center uppercase tracking-widest">2. ELIGE TU PAQUETE</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {PACKAGES.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} vehicleId={selectedVehicle} isSelected={selectedPackage === pkg.id} onSelect={handlePackageSelect} />
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h3 className="text-xl font-bold text-white mb-8 text-center uppercase tracking-widest">3. SERVICIOS ADICIONALES</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {UPSELLS.map((upsell) => (
                <UpsellButton key={upsell.id} upsell={upsell} vehicleId={selectedVehicle} isSelected={selectedUpsells.includes(upsell.id)} onToggle={toggleUpsell} />
              ))}
            </div>
          </div>

          {selectedPackage && (
            <div className="glass-card p-10 md:p-14 rounded-[2rem] text-center max-w-2xl mx-auto border-t-2 border-[#1F6AE1]/30 glow-primary">
              <p className="text-[#C9CDD3] mb-4 font-bold uppercase tracking-[0.2em] text-sm md:text-base">TOTAL ESTIMADO</p>
              <div className="mb-10">
                <span className="text-6xl md:text-8xl font-extrabold text-white">
                  ${total.toLocaleString()}
                </span>
                <span className="text-xl md:text-2xl font-bold text-[#1F6AE1] ml-4 italic">MXN</span>
                <p className="mt-4 text-[#94A3B8] text-xs md:text-sm font-medium uppercase tracking-widest">
                  *Precios base para Zona Poniente. Aplica +15% en el resto de la CDMX.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMessage(selectedVehicle, selectedPackage, selectedUpsells, total)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleCTAClick('WhatsApp')}
                  className="flex-1 inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1fb355] text-white font-bold px-10 py-5 rounded-full uppercase tracking-wider transition-all hover:scale-105 glow-whatsapp"
                  data-testid="pricing-whatsapp-btn"
                >
                  <WhatsAppIcon className="w-6 h-6" />
                  Cotizar por WhatsApp
                </a>
                
                <button
                  onClick={() => {
                    handleCTAClick('Crypto');
                    setIsCryptoOpen(true);
                  }}
                  className="inline-flex items-center gap-4 bg-white/5 hover:bg-[#1F6AE1]/10 text-white border border-white/10 hover:border-[#1F6AE1]/50 font-bold px-10 py-5 rounded-full uppercase tracking-wider transition-all hover:scale-105"
                >
                  <Bitcoin className="w-6 h-6 text-[#F7931A]" />
                  Pagar con Cripto
                </button>
              </div>
            </div>
          )}

          <CryptoModal 
            isOpen={isCryptoOpen} 
            onClose={() => setIsCryptoOpen(false)} 
            selectedPackage={PACKAGES.find(p => p.id === selectedPackage)?.name}
            total={total}
          />
        </div>
      </div>
    </section>
  );
};
