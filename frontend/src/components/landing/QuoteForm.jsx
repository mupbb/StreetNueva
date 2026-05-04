import { useState, useCallback, useMemo } from "react";
import { Car, Sparkles, Phone, Check, Plus, User, Send, MessageCircle } from "lucide-react";
import { VEHICLE_TYPES, PACKAGES, UPSELLS, WHATSAPP_NUMBER, fadeInUp, staggerContainer } from "@/lib/constants";
import { revealIn, revealVisible, viewportOnce, WhatsAppIcon } from "./shared";
import { trackUserAction } from "@/lib/apiUtils";

const INPUT_CLASS = "w-full px-4 py-3 rounded-xl bg-[#0B0D10] border border-white/10 text-white placeholder-[#94A3B8] focus:border-[#1F6AE1] focus:outline-none transition-colors";

const buildQuoteMessage = (formData, total) => {
  const vehicle = VEHICLE_TYPES.find(v => v.id === formData.vehicle);
  const pkg = PACKAGES.find(p => p.id === formData.package);
  let msg = `*SOLICITUD DE COTIZACIÓN*\n\n`;
  msg += `👤 *Nombre:* ${formData.name}\n📞 *Teléfono:* ${formData.phone}\n🚗 *Vehículo:* ${vehicle?.name}`;
  if (formData.vehicleModel) msg += ` - ${formData.vehicleModel}`;
  msg += `\n`;
  if (pkg) msg += `\n📦 *Paquete:* ${pkg.name}\n💰 *Precio base:* $${pkg.prices[formData.vehicle].toLocaleString()} MXN\n`;
  if (formData.upsells.length > 0) {
    msg += `\n➕ *Servicios adicionales:*\n`;
    formData.upsells.forEach(id => {
      const u = UPSELLS.find(x => x.id === id);
      if (u) msg += `• ${u.name} - $${u.prices[formData.vehicle].toLocaleString()} MXN\n`;
    });
  }
  if (formData.message) msg += `\n💬 *Mensaje:* ${formData.message}\n`;
  msg += `\n💵 *TOTAL ESTIMADO:* $${total.toLocaleString()} MXN`;
  return encodeURIComponent(msg);
};

// Removed local sendMetaEvent in favor of centralized trackUserAction

const FormPackageButton = ({ pkg, vehicleId, isSelected, onSelect }) => (
  <button type="button" onClick={() => onSelect(pkg.id)}
    className={`p-4 rounded-xl text-left transition-all border-2 ${isSelected ? 'border-[#1F6AE1] bg-[#1F6AE1]/10' : 'border-white/10 hover:border-white/30 bg-[#0B0D10]'}`}
    style={{ borderColor: isSelected ? pkg.color : undefined }}
    data-testid={`form-package-${pkg.id}`}
  >
    <div className="flex items-center justify-between mb-2">
      <span className="font-bold text-white">{pkg.name}</span>
      {isSelected && <Check className="w-5 h-5" style={{ color: pkg.color }} />}
    </div>
    <p className="text-2xl font-bold" style={{ color: pkg.color }}>${pkg.prices[vehicleId].toLocaleString()}</p>
    <p className="text-xs text-[#94A3B8] mt-1">{pkg.subtitle}</p>
  </button>
);

const FormUpsellButton = ({ upsell, vehicleId, isSelected, onToggle }) => (
  <button type="button" onClick={() => onToggle(upsell.id)}
    className={`p-3 rounded-xl text-left transition-all flex items-center justify-between ${isSelected ? 'bg-[#1F6AE1]/20 border-2 border-[#1F6AE1]' : 'bg-[#0B0D10] border border-white/10 hover:border-white/30'}`}
    data-testid={`form-upsell-${upsell.id}`}
  >
    <div className="flex items-center gap-2">
      <span className="text-xl">{upsell.icon}</span>
      <div>
        <p className="text-sm text-white">{upsell.name}</p>
        <p className="text-xs text-[#1F6AE1] font-bold">+${upsell.prices[vehicleId].toLocaleString()}</p>
      </div>
    </div>
    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isSelected ? 'bg-[#1F6AE1] text-white' : 'border border-[#94A3B8]'}`}>
      {isSelected && <Check className="w-3 h-3" />}
    </div>
  </button>
);

export const QuoteForm = () => {
  const [formData, setFormData] = useState({
    name: '', phone: '', vehicle: 'auto_mediano', vehicleModel: '', package: '', upsells: [], message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const toggleUpsell = useCallback((upsellId) => {
    setFormData(prev => ({
      ...prev,
      upsells: prev.upsells.includes(upsellId) ? prev.upsells.filter(id => id !== upsellId) : [...prev.upsells, upsellId]
    }));
  }, []);

  const selectPackage = useCallback((pkgId) => {
    setFormData(prev => ({ ...prev, package: pkgId }));
  }, []);

  const total = useMemo(() => {
    let sum = 0;
    if (formData.package) {
      const pkg = PACKAGES.find(p => p.id === formData.package);
      if (pkg) sum += pkg.prices[formData.vehicle];
    }
    formData.upsells.forEach(id => {
      const u = UPSELLS.find(x => x.id === id);
      if (u) sum += u.prices[formData.vehicle];
    });
    return sum;
  }, [formData.package, formData.vehicle, formData.upsells]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.package) {
      alert('Por favor completa los campos obligatorios');
      return;
    }
    setIsSubmitting(true);
    
    // Track Lead event via CAPI
    trackUserAction('SubmitLead', { 
      price: total, 
      phone: formData.phone, 
      name: formData.name, 
      package: formData.package 
    });

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${buildQuoteMessage(formData, total)}`, '_blank');
    setTimeout(() => setIsSubmitting(false), 1000);
  }, [formData, total]);

  return (
    <section className="py-16 md:py-24 bg-black" data-testid="quote-form-section">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <div>
          <div className="mb-12 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Send className="w-6 h-6 text-[#1F6AE1]" />
              <span className="text-[#1F6AE1] font-bold tracking-[0.2em] text-xs md:text-sm uppercase">COTIZACIÓN DIRECTA</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-6">
              SOLICITA TU <span className="text-[#1F6AE1]">COTIZACIÓN</span>
            </h2>
            <p className="text-[#C9CDD3] max-w-lg mx-auto font-medium">Completa el formulario y recibe tu cotización personalizada por WhatsApp</p>
          </div>

          <form onSubmit={handleSubmit} className="glass-card p-8 md:p-12 rounded-[2.5rem] space-y-8 border-t border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-white font-bold uppercase tracking-wider text-xs mb-3"><User className="w-4 h-4 inline mr-2 text-[#1F6AE1]" />Nombre completo *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Tu nombre" className={INPUT_CLASS} required data-testid="form-name" />
              </div>
              <div>
                <label className="block text-white font-bold uppercase tracking-wider text-xs mb-3"><Phone className="w-4 h-4 inline mr-2 text-[#1F6AE1]" />Teléfono WhatsApp *</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="55 1234 5678" className={INPUT_CLASS} required data-testid="form-phone" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-white font-bold uppercase tracking-wider text-xs mb-3"><Car className="w-4 h-4 inline mr-2 text-[#1F6AE1]" />Tipo de vehículo *</label>
                <select name="vehicle" value={formData.vehicle} onChange={handleChange} className={INPUT_CLASS} data-testid="form-vehicle">
                  {VEHICLE_TYPES.map(v => <option key={v.id} value={v.id}>{v.icon} {v.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-white font-bold uppercase tracking-wider text-xs mb-3">Marca y modelo (opcional)</label>
                <input type="text" name="vehicleModel" value={formData.vehicleModel} onChange={handleChange} placeholder="Ej: Honda Civic 2022" className={INPUT_CLASS} data-testid="form-model" />
              </div>
            </div>

            <div>
              <label className="block text-white font-bold uppercase tracking-wider text-xs mb-5"><Sparkles className="w-4 h-4 inline mr-2 text-[#1F6AE1]" />Selecciona tu paquete *</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {PACKAGES.map(pkg => (
                  <FormPackageButton key={pkg.id} pkg={pkg} vehicleId={formData.vehicle} isSelected={formData.package === pkg.id} onSelect={selectPackage} />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-white font-bold uppercase tracking-wider text-xs mb-5"><Plus className="w-4 h-4 inline mr-2 text-[#1F6AE1]" />Servicios adicionales (opcional)</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {UPSELLS.map(upsell => (
                  <FormUpsellButton key={upsell.id} upsell={upsell} vehicleId={formData.vehicle} isSelected={formData.upsells.includes(upsell.id)} onToggle={toggleUpsell} />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-white font-bold uppercase tracking-wider text-xs mb-3"><MessageCircle className="w-4 h-4 inline mr-2 text-[#1F6AE1]" />Mensaje adicional (opcional)</label>
              <textarea name="message" value={formData.message} onChange={handleChange} placeholder="¿Algo que debamos saber sobre tu vehículo?" rows={4} className={`${INPUT_CLASS} resize-none`} data-testid="form-message" />
            </div>

            {formData.package ? (
              <div className="bg-black/40 p-8 rounded-2xl border border-[#1F6AE1]/30 glow-primary">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-2">
                  <span className="text-[#C9CDD3] font-bold uppercase tracking-widest text-sm">TOTAL ESTIMADO:</span>
                  <div className="text-right">
                    <span className="text-4xl font-extrabold text-white">${total.toLocaleString()} <span className="text-base text-[#1F6AE1] italic font-bold">MXN</span></span>
                    <p className="text-[#94A3B8] text-[10px] uppercase tracking-widest mt-1">*Base Poniente. +15% resto de CDMX.</p>
                  </div>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full btn-whatsapp text-white font-extrabold py-5 rounded-2xl uppercase tracking-[0.2em] transition-all hover:scale-[1.02] flex items-center justify-center gap-4 disabled:opacity-50 glow-whatsapp" data-testid="form-submit">
                  <WhatsAppIcon className="w-6 h-6" />
                  {isSubmitting ? 'Enviando...' : 'Enviar por WhatsApp'}
                </button>
              </div>
            ) : (
              <p className="text-center text-[#C9CDD3] text-sm font-bold uppercase tracking-widest bg-white/5 py-4 rounded-xl">Selecciona un paquete para ver el total</p>
            )}
          </form>
        </div>
      </div>
    </section>

  );
};