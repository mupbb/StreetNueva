import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import { blogPosts } from "@/data/blogData";

export const BlogSection = () => {
  return (
    <section className="py-24 bg-[#0B0D10] relative overflow-hidden" id="tips">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#1F6AE1]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#1F6AE1]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F6AE1]/10 border border-[#1F6AE1]/20 text-[#1F6AE1] text-sm font-semibold tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-[#1F6AE1] animate-pulse" />
            EDUCACIÓN PREMIUM
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif", textTransform: "uppercase" }}>
            EL PRECIO DE LA <span className="text-[#1F6AE1]">IGNORANCIA AUTOMOTRIZ</span>
          </h2>
          <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto">
            La mediocridad cuesta caro. Descubre por qué los lavados tradicionales están destruyendo tu inversión y cómo la química de alto nivel puede salvarla.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link 
              key={post.id} 
              to={`/tips/${post.slug}`}
              className="group glass-card rounded-2xl overflow-hidden hover:border-[#1F6AE1]/40 transition-all duration-300 flex flex-col h-full bg-white/5 border border-white/10"
            >
              {/* Image Container with Lazy Loading */}
              <div className="relative h-56 overflow-hidden">
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors z-10" />
                <img 
                  src={post.image} 
                  alt={post.altText || post.title} 
                  loading="lazy"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3 py-1 rounded-md bg-[#1F6AE1]/90 backdrop-blur-md border border-white/20 text-[10px] font-black text-white uppercase tracking-[0.15em]">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-[#94A3B8] text-xs font-medium mb-3">
                  <Clock className="w-3.5 h-3.5" />
                  Lectura: {post.readTime}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#1F6AE1] transition-colors line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-[#94A3B8] text-sm mb-6 line-clamp-3 flex-grow">
                  {post.shortDescription}
                </p>

                <div className="flex items-center text-[#1F6AE1] font-semibold text-sm uppercase tracking-wider group-hover:translate-x-2 transition-transform">
                  LEER LA VERDAD <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Link to="/tips" className="inline-flex items-center gap-2 text-white bg-[#1F6AE1] hover:bg-[#1F6AE1]/80 px-8 py-4 rounded-full font-bold uppercase tracking-wider transition-colors shadow-[0_0_20px_rgba(31,106,225,0.3)]">
            Ver Todos los Tips <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};
