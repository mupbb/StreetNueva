import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { WHATSAPP_LINK } from "@/lib/constants";
import { scaleIn, scaleNormal, scaleHover, scaleTap } from "./shared";

export const WhatsAppFloat = () => (
  <motion.a
    href={WHATSAPP_LINK}
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-50 btn-whatsapp text-white p-4 rounded-full animate-pulse-ring glow-whatsapp shadow-2xl"
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    data-testid="whatsapp-float-btn"
  >
    <MessageCircle className="w-8 h-8" fill="white" />
  </motion.a>
);

