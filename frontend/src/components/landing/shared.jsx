import { Star } from "lucide-react";

// Converting to functions to ensure hoisting and avoid initialization race conditions
export function StarRating({ rating, size = "w-5 h-5" }) {
  return (
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
}

export function SectionHeader({ icon: Icon, label, title, highlight, centered = false }) {
  return (
    <div className={`mb-6 md:mb-8 ${centered ? 'text-center' : ''}`}>
      <div className={`flex items-center gap-3 mb-4 ${centered ? 'justify-center' : ''}`}>
        <Icon className="w-6 h-6 text-[#1F6AE1]" />
        <span className="text-[#1F6AE1] font-semibold tracking-wider text-sm">{label}</span>
      </div>
      <h2 className="text-3xl md:text-5xl font-bold text-white">
        {title} <span className="text-[#1F6AE1]">{highlight}</span>
      </h2>
    </div>
  );
}

export const viewportOnce = { once: true };
export const hoverLiftSmall = { y: -8 };
export const hoverLiftLarge = { y: -12 };