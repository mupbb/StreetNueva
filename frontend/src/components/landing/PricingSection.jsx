import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Calculator, CheckCircle2, Check, Plus, MessageCircle } from "lucide-react";
import { VEHICLE_TYPES, PACKAGES, UPSELLS, WHATSAPP_NUMBER, CRYPTO, fadeInUp, staggerContainer } from "@/lib/constants";
import { CryptoModal } from "./CryptoModal";
import { hoverLiftSmall, revealIn, revealVisible, viewportOnce } from "./shared";
import { trackUserAction } from "@/lib/apiUtils";

const VehicleSelector = ({ selected, onSelect }) => (
  <motion.div variants={fadeInUp} className="mb-6">
    <h3 className="text-lg font-bold text-white mb-3 text-center">1. Selecciona tu vehículo</h3>
    <div className="flex flex-wrap justify-center gap-3">
      {VEHICLE_TYPES.map((vehicle) => (
        <button
          key={vehicle.id}
          onClick={() => onSelect(vehicle.id)}
          className={`px-4 py-3 rounded-xl font-medium transition-all ${
            selected === vehicle.id
              ? 'bg-[#1F6AE1] text-white shadow-[0_0_20px_rgba(31,106,225,0.4)]'
              : 'glass-card text-[#C9CDD3] hover:border-[#1F6AE1]/50'
          }`}
          data-testid={`vehicle-${vehicle.id}`}
        >
          <span className="mr-2">{vehicle.icon}</span>
          {vehicle.name}
        </button>
      ))}
    </div>
  </motion.div>
);

const PackageCard = ({ pkg, vehicleId, isSelected, onSelect }) => (
  <motion.div
    whileHover={hoverLiftSmall}
    onClick={() => onSelect(pkg.id)}
    className={`cursor-pointer rounded-2xl overflow-hidden transition-all ${
      isSelected ? 'ring-2 ring-offset-2 ring-offset-[#0B0D10]' : ''
    }`}
    style={{ borderColor: isSelected ? pkg.color : 'transparent', ringColor: pkg.color }}
    data-testid={`package-${pkg.id}`}
  >
    <div className="relative h-48 overflow-hidden">
      <img src={pkg.image} alt={pkg.altText || pkg.name} className="w-full h-full object-cover" />
      {isSelected && (
        <div className="absolute top-4 right-4 bg-white text-[#0B0D10] p-2 rounded-full">
          <Check className="w-5 h-5" />
        </div>
      )}
    </div>
    <div className="glass-card p-6" style={{ borderTopColor: pkg.color, borderTopWidth: '3px' }}>
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
  </motion.div>
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
      <span className="text-2xl">{upsell.icon}</span>
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

  const handleCTAClick = useCallback((type) => {
    trackUserAction('InitiatePayment', { price: total, type });
  }, [total]);

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

  return (
    <section className="py-16 md:py-24 bg-black" data-testid="pricing-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="mb-12 md:mb-16 text-center">
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
          </motion.div>

          <VehicleSelector selected={selectedVehicle} onSelect={setSelectedVehicle} />

          <motion.div variants={fadeInUp} className="mb-12">
            <h3 className="text-xl font-bold text-white mb-8 text-center uppercase tracking-widest">2. ELIGE TU PAQUETE</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {PACKAGES.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} vehicleId={selectedVehicle} isSelected={selectedPackage === pkg.id} onSelect={handlePackageSelect} />
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="mb-12">
            <h3 className="text-xl font-bold text-white mb-8 text-center uppercase tracking-widest">3. SERVICIOS ADICIONALES</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {UPSELLS.map((upsell) => (
                <UpsellButton key={upsell.id} upsell={upsell} vehicleId={selectedVehicle} isSelected={selectedUpsells.includes(upsell.id)} onToggle={toggleUpsell} />
              ))}
            </div>
          </motion.div>

          {selectedPackage && (
            <motion.div initial={revealIn} animate={revealVisible} className="glass-card p-10 md:p-14 rounded-[2rem] text-center max-w-2xl mx-auto border-t-2 border-[#1F6AE1]/30 glow-primary">
              <p className="text-[#C9CDD3] mb-4 font-bold uppercase tracking-[0.2em] text-sm md:text-base">TOTAL ESTIMADO</p>
              <div className="mb-10">
                <span className="text-6xl md:text-8xl font-extrabold text-white">
                  ${total.toLocaleString()}
                </span>
                <span className="text-xl md:text-2xl font-bold text-[#1F6AE1] ml-4 italic">MXN</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMessage(selectedVehicle, selectedPackage, selectedUpsells, total)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleCTAClick('WhatsApp')}
                  className="inline-flex items-center gap-4 btn-whatsapp text-white font-bold px-10 py-5 rounded-full uppercase tracking-wider transition-all hover:scale-105 glow-whatsapp"
                  data-testid="pricing-whatsapp-btn"
                >
                  <MessageCircle className="w-6 h-6" />
                  Solicitar este servicio
                </a>
                
                <button
                  onClick={() => {
                    handleCTAClick('Crypto');
                    setIsCryptoOpen(true);
                  }}
                  className="inline-flex items-center gap-4 bg-white/5 hover:bg-[#1F6AE1]/10 text-white border border-white/10 hover:border-[#1F6AE1]/50 font-bold px-10 py-5 rounded-full uppercase tracking-wider transition-all hover:scale-105"
                >
                  <span className="text-2xl">💎</span>
                  Pagar con Cripto
                </button>
              </div>
            </motion.div>
          )}

          <CryptoModal 
            isOpen={isCryptoOpen} 
            onClose={() => setIsCryptoOpen(false)} 
            selectedPackage={PACKAGES.find(p => p.id === selectedPackage)?.name}
            total={total}
          />
        </motion.div>
      </div>
    </section>
  );
};

