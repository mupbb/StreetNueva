import { motion } from "framer-motion";
import { Star } from "lucide-react";

// Shared animation constants (avoid inline objects)
export const hoverLiftSmall = { y: -8 };
export const hoverLiftLarge = { y: -12 };
export const hoverSlideRight = { x: 8 };
export const scaleIn = { scale: 0 };
export const scaleNormal = { scale: 1 };
export const scaleHover = { scale: 1.1 };
export const scaleTap = { scale: 0.95 };
export const revealIn = { opacity: 0, y: 20 };
export const revealVisible = { opacity: 1, y: 0 };
export const viewportOnce = { once: true };

// Reusable StarRating component (extracted from GoogleReviews)
export const StarRating = ({ rating, size = "w-5 h-5" }) => (
  <div className="flex">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={`star-${star}`}
        className={`${size} ${star <= Math.round(rating) ? 'text-[#FFB800]' : 'text-[#94A3B8]/30'}`}
        fill={star <= Math.round(rating) ? '#FFB800' : 'currentColor'}
      />
    ))}
  </div>
);

// Reusable SectionHeader
export const SectionHeader = ({ icon: Icon, label, title, highlight, centered = false }) => (
  <motion.div className={`mb-6 md:mb-8 ${centered ? 'text-center' : ''}`}>
    <div className={`flex items-center gap-3 mb-4 ${centered ? 'justify-center' : ''}`}>
      <Icon className="w-6 h-6 text-[#1F6AE1]" />
      <span className="text-[#1F6AE1] font-semibold tracking-wider text-sm">{label}</span>
    </div>
    <h2 className="text-3xl md:text-5xl font-bold text-white">
      {title} <span className="text-[#1F6AE1]">{highlight}</span>
    </h2>
  </motion.div>
);
