import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { MoveHorizontal } from "lucide-react";
import { IMAGES } from "@/lib/constants";

export const BeforeAfterSlider = () => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef(null);

  const handleMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX || (e.touches && e.touches[0].clientX);
    const pos = ((x - rect.left) / rect.width) * 100;
    setSliderPos(Math.min(Math.max(pos, 0), 100));
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-5xl mx-auto aspect-[16/10] md:aspect-[16/9] rounded-[2.5rem] overflow-hidden cursor-ew-resize border-2 border-white/10 shadow-2xl group"
      onMouseMove={handleMove}
      onTouchMove={handleMove}
    >
      {/* After Image (Bottom) */}
      <img 
        src={IMAGES.compareAfter} 
        alt="Acabado espejo y pintura restaurada tras detallado automotriz premium - Street Prime Detail" 
        className="absolute inset-0 w-full h-full object-cover select-none"
      />

      {/* Before Image (Top, Clipped) */}
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden select-none grayscale-[0.2]"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      >
        <img 
          src={IMAGES.compareBefore} 
          alt="Estado inicial sucio del vehículo antes del detallado profesional - Street Prime Detail" 
          className="absolute inset-0 w-full h-full object-cover"
          style={{ width: containerRef.current?.offsetWidth }}
        />
        {/* Before Label */}
        <div className="absolute top-8 left-8 bg-black/50 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-white text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
          Estado Inicial (Sucio)
        </div>
      </div>

      {/* After Label */}
      <div className="absolute top-8 right-8 bg-[#1F6AE1]/80 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-white text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
        Street Prime Detail
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white z-20 pointer-events-none"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center text-black">
          <MoveHorizontal className="w-6 h-6" />
        </div>
      </div>

      {/* Instruction Overlay */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-2xl text-white text-sm font-bold uppercase tracking-[0.2em] shadow-2xl animate-bounce">
          Desliza para comparar
        </div>
      </div>
    </div>
  );
};
