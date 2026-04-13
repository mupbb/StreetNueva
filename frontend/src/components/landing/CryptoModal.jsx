import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, ExternalLink, Wallet, CheckCircle2 } from "lucide-react";
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

  const bitcoinLogo = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white">
      <path d="M11.75 14.5h3.5c1.46 0 2.5-1.12 2.5-2.5s-1.04-2.5-2.5-2.5h-3.5" />
      <path d="M11.75 9.5h2.5c1.17 0 2-0.9 2-2s-0.83-2-2-2h-2.5" />
      <path d="M11.75 5v14.5" />
      <path d="M13.75 4v1" />
      <path d="M9.75 4v1" />
      <path d="M13.75 19v1" />
      <path d="M9.75 19v1" />
      <path d="M7.75 7.5h4" />
      <path d="M7.75 12h4" />
      <path d="M7.75 16.5h4" />
    </svg>
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Overlay */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/90 backdrop-blur-md"
        />

        {/* Modal */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          className="relative w-full max-w-lg bg-[#050505] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_80px_rgba(31,106,225,0.3)]"
        >
          {/* Header */}
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-[#1F6AE1]/20 via-transparent to-transparent">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#1F6AE1] rounded-2xl shadow-[0_0_20px_rgba(31,106,225,0.4)]">
                {bitcoinLogo}
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
            {/* Tabs Selector */}
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

            {/* Tab Display Area */}
            <div className="min-h-[340px] flex flex-col items-center justify-center">
              {activeTab === "phantom" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full text-center">
                   <div className="bg-white p-3 rounded-[2rem] inline-block mb-6 shadow-[0_0_30px_rgba(171,159,242,0.2)]">
                    <img src={IMAGES.phantom_qr} alt="Phantom SOL QR" className="w-52 h-52 object-contain" />
                  </div>
                  <div className="space-y-4">
                    <p className="text-white font-bold text-lg">Phantom Wallet (SOL/USDC)</p>
                    <div className="flex items-center gap-2 mx-auto max-w-[280px] bg-white/5 p-3 rounded-xl border border-white/10 group">
                      <code className="text-[10px] text-[#AB9FF2] truncate flex-1 font-mono">{CRYPTO.phantom_wallet}</code>
                      <button onClick={() => copyToClipboard(CRYPTO.phantom_wallet, "Wallet")} className="p-2 hover:text-white text-[#AB9FF2] transition-colors">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "bitso" && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center">
                  <div className="bg-white p-3 rounded-[2rem] inline-block mb-6 shadow-[0_0_30px_rgba(31,106,225,0.2)]">
                    <img src={IMAGES.bitso_qr} alt="Bitso QR" className="w-52 h-52 object-contain" />
                  </div>
                  <p className="text-white font-bold text-lg mb-2">Bitso Transfer</p>
                  <p className="text-[#94A3B8] text-xs max-w-xs leading-relaxed uppercase tracking-wider">
                    Escanea para enviar moneda local o cripto a <br />
                    <span className="text-white font-black">Jorge Alberto Diaz Ruiz</span>
                  </p>
                </motion.div>
              )}

              {activeTab === "bybit" && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center">
                  <div className="bg-white p-3 rounded-[2rem] inline-block mb-6 shadow-[0_0_30px_rgba(255,184,0,0.2)]">
                    <img src={IMAGES.bybit_qr} alt="Bybit QR" className="w-52 h-52 object-contain" />
                  </div>
                  <p className="text-white font-bold text-lg mb-2">Bybit Pay</p>
                  <p className="text-[#94A3B8] text-xs max-w-xs leading-relaxed uppercase tracking-wider">
                    Abre tu App de Bybit y escanea el código para procesar el pago de forma instantánea.
                  </p>
                </motion.div>
              )}
            </div>
          </div>

          {/* CTA Area */}
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
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
