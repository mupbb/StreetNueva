import { X, Copy, CheckCircle2 } from "lucide-react";
import { CRYPTO, IMAGES, WHATSAPP_NUMBER } from "@/lib/constants";
import { useState } from "react";
import { toast } from "sonner";

export const CryptoModal = ({ isOpen, onClose, selectedPackage, total }) => {
  const [activeTab, setActiveTab] = useState("bitso");

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado al portapapeles`);
  };

  const handleConfirmPayment = () => {
    const message = encodeURIComponent(
      `Hola! He realizado el pago de mi servicio:\n\n` +
      `📦 Paquete: ${selectedPackage || "Servicio Detallado"}\n` +
      `💰 Total: $${total?.toLocaleString() || "0"} MXN\n` +
      `💎 Método: Cripto (${activeTab.toUpperCase()})\n\n` +
      `Adjunto el comprobante de la transacción.`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-md" />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-[#050505] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_80px_rgba(31,106,225,0.3)]">
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-[#1F6AE1]/20 via-transparent to-transparent">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#1F6AE1] rounded-2xl shadow-[0_0_20px_rgba(31,106,225,0.4)]">
              <span className="text-white text-xl">💎</span>
            </div>
            <div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight italic" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>PAGO CRYPTO</h3>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                <p className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-widest">Gateway Seguro 256-bit</p>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all group">
            <X className="w-6 h-6 text-[#94A3B8] group-hover:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Tabs */}
          <div className="flex gap-2 mb-10 bg-white/5 p-1.5 rounded-[1.2rem] border border-white/5">
            {[
              { id: "bitso", name: "Bitso" },
              { id: "bybit", name: "Bybit" },
              { id: "phantom", name: "Phantom" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-4 rounded-[0.8rem] text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id ? 'bg-[#1F6AE1] text-white shadow-lg' : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* Tab Display */}
          <div className="min-h-[340px] flex flex-col items-center justify-center">
            <div className="flex flex-col items-center text-center w-full">
              <div className="bg-white p-0 rounded-[2rem] w-48 h-48 md:w-64 md:h-64 flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.15)] overflow-hidden mx-auto mb-8">
                <img 
                  src={IMAGES[`${activeTab}_qr`]} 
                  alt={`${activeTab} QR`} 
                  className={`w-full h-full object-contain transition-transform duration-500 scale-[${
                    activeTab === 'bitso' ? '2.4' : activeTab === 'bybit' ? '2.8' : '1.3'
                  }]`}
                />
              </div>

              <div className="space-y-3">
                <p className="text-white font-bold text-xl uppercase tracking-tight italic">
                  {activeTab === 'phantom' ? 'Phantom Wallet (SOL/USDC)' : 
                   activeTab === 'bitso' ? 'Bitso Transfer' : 'Bybit Pay'}
                </p>
                
                {activeTab === 'phantom' ? (
                  <div className="flex items-center gap-2 mx-auto max-w-[280px] bg-white/5 p-3 rounded-xl border border-white/10">
                    <code className="text-[10px] text-[#AB9FF2] truncate flex-1 font-mono">{CRYPTO.phantom_wallet}</code>
                    <button onClick={() => copyToClipboard(CRYPTO.phantom_wallet, "Wallet")} className="p-2 hover:text-white text-[#AB9FF2] transition-colors">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <p className="text-[#94A3B8] text-xs max-w-xs leading-relaxed uppercase tracking-wider font-medium">
                    {activeTab === 'bitso' ? (
                      <>Escanea para enviar moneda local o cripto a<br/><span className="text-white font-black">Jorge Alberto Diaz Ruiz</span></>
                    ) : (
                      <>Abre tu App de Bybit y escanea el código para<br/>procesar el pago de forma instantánea.</>
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="p-8 bg-white/5 border-t border-white/5">
          <button 
            onClick={handleConfirmPayment}
            className="w-full bg-[#1F6AE1] hover:bg-[#1C5FCB] text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] shadow-[0_10px_30px_rgba(31,106,225,0.3)] uppercase tracking-[0.1em]"
          >
            <CheckCircle2 className="w-6 h-6" />
            Ya realicé el pago · Confirmar
          </button>
          <p className="mt-4 text-center text-[10px] text-[#555] font-bold uppercase tracking-widest">
            Street Prime Detail © Secure Payment Node
          </p>
        </div>
      </div>
    </div>
  );
};