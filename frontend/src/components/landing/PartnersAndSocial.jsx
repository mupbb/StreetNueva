import { PARTNER_BRANDS, SOCIAL_LINKS, fadeInUp, staggerContainer } from "@/lib/constants";
import { Sparkles, Share2, Facebook, Instagram, Linkedin } from "lucide-react";

// Custom SVG Icons for TikTok, Threads, and Kick to match exactly
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47V18c0 3.12-2.54 5.66-5.66 5.66-3.12 0-5.66-2.54-5.66-5.66 0-3.12 2.54-5.66 5.66-5.66.49 0 .97.07 1.43.21V16.5c-.46-.14-.95-.21-1.43-.21-2.02 0-3.66 1.64-3.66 3.66 0 2.02 1.64 3.66 3.66 3.66 2.02 0 3.66-1.64 3.66-3.66V0z"/>
  </svg>
);

const ThreadsIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12.554 4.884c-3.19 0-5.641 2.615-5.641 5.676 0 3.061 2.451 5.676 5.641 5.676 1.42 0 2.493-.365 3.321-.864l1.104.912c-1.127.766-2.5 1.252-4.425 1.252-4.326 0-7.337-3.411-7.337-7.276 0-3.865 3.011-7.276 7.337-7.276 3.19 0 5.485 1.564 6.754 4.108V5.34h1.696v4.945c0 3.713-3.073 6.643-6.522 6.643-3.449 0-6.142-2.93-6.142-6.643 0-3.713 2.693-6.642 6.142-6.642 1.942 0 3.255 1.353 3.255 3.253 0 1.9-1.313 3.253-3.255 3.253-2.115 0-3.893-1.637-3.893-3.77 0-2.133 1.778-3.77 3.893-3.77 1.05 0 1.942.345 2.502.825l.89-.958c-.805-.724-2.022-1.222-3.392-1.222zm4.821 5.06h-.002c0-1.018-.69-1.558-1.563-1.558-.874 0-1.558.54-1.558 1.558s.684 1.558 1.558 1.558h.002c.873 0 1.563-.54 1.563-1.558z"/>
  </svg>
);

const KickIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M11.411 12l5.523-5.522h-3.216L8.195 12l5.523 5.522h3.216L11.411 12zM4.061 5.344v13.312h3.216V5.344H4.061z"/>
  </svg>
);

const GET_SOCIAL_ICON = (id) => {
  switch (id) {
    case 'facebook': return <Facebook className="w-5 h-5" />;
    case 'instagram': return <Instagram className="w-5 h-5" />;
    case 'linkedin': return <Linkedin className="w-5 h-5" />;
    case 'tiktok': return <TikTokIcon />;
    case 'threads': return <ThreadsIcon />;
    case 'kick': return <KickIcon />;
    default: return <Share2 className="w-5 h-5" />;
  }
};

export const PartnersAndSocial = () => {
  return (
    <div className="bg-black">
      {/* Section 1: Productos Afiliados */}
      <section className="py-20 border-t border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-4 h-4 text-[#1F6AE1]" />
            <span className="text-[#1F6AE1] font-bold tracking-[0.2em] text-xs uppercase">CALIDAD GARANTIZADA</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">
            PRODUCTOS <span className="text-[#1F6AE1]">AFILIADOS</span>
          </h2>
        </div>

        <div className="relative flex overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap gap-6 md:gap-10 py-4">
            {[...PARTNER_BRANDS, ...PARTNER_BRANDS, ...PARTNER_BRANDS].map((brand, idx) => (
              <div 
                key={`${brand.id}-${idx}`} 
                className="w-48 md:w-64 h-24 md:h-32 bg-[#0D0D0D] flex items-center justify-center p-0 overflow-hidden transition-all duration-500 rounded-2xl border border-white/5 scale-95 hover:scale-100"
              >
                <div className="w-full h-full flex items-center justify-center overflow-hidden">
                  <img 
                    src={brand.logo} 
                    alt={`Logo de ${brand.name} - Producto aliado de Street Prime Detail`} 
                    className="w-full h-full object-contain opacity-90 hover:opacity-100 transition-opacity scale-[2.2]" 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Nuestras Redes Sociales */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="mb-12">
            <p className="text-[#1F6AE1] font-bold tracking-[0.2em] text-xs uppercase mb-3">SÍGUENOS</p>
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">
              NUESTRAS <span className="text-[#1F6AE1]">REDES SOCIALES</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 max-w-7xl mx-auto">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#0D0D0D] border border-white/5 px-3 py-5 rounded-2xl hover:bg-[#1a1a1a] border-white/10 hover:border-[#1F6AE1]/50 transition-all group justify-center sm:justify-start"
                data-testid={`social-${link.id}`}
              >
                <div className="text-white/70 group-hover:text-white transition-colors">
                  {GET_SOCIAL_ICON(link.id)}
                </div>
                <span className="text-white/60 group-hover:text-white font-bold text-sm tracking-wide">
                  {link.name}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};