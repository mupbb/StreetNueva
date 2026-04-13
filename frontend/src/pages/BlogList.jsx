import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock, ArrowRight } from "lucide-react";
import { blogPosts } from "@/data/blogData";
import { useSEO } from "@/hooks/useSEO";
import { Footer } from "@/components/landing/Footer";

const LOGO_URL = "https://customer-assets.emergentagent.com/job_auto-detail/artifacts/bkbn2cvl_LOGO%20TRANSPARENTE.png";

export const BlogList = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // SEO Injection Hook
  useSEO({
    title: "Tips de Cuidados y Detallado Automotriz | Street Prime Detail",
    description: "Aprende los secretos de agencia para cuidar la estética, pintura e interiores de tu auto en la CDMX. Descubre por qué los lavados tradicionales dañan tu inversión.",
    keywords: "tips cuidado automotriz, blog de detailing, proteccion de pintura auto, detallado de interiores, evitar swirls coche",
    url: "/tips",
    type: "website"
  });

  return (
    <div className="min-h-screen bg-[#0B0D10] text-[#C9CDD3]">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#0B0D10]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 text-[#94A3B8] hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden md:inline font-semibold">Volver a Home</span>
          </Link>
          <img src={LOGO_URL} alt="Street Prime Detail Logo" className="h-8" />
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-14 md:py-24">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif", textTransform: "uppercase" }}>
            EL CONOCIMIENTO ES <span className="text-[#1F6AE1]">PODER PARA TU VEHÍCULO</span>
          </h1>
          <p className="text-xl text-[#94A3B8]">
            La brutal verdad sobre la industria del autolavado en México que nadie te quiere decir. Toma el control del cuidado de tu inversión.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogPosts.map((post) => (
            <Link 
              key={post.id} 
              to={`/tips/${post.slug}`}
              className="group glass-card rounded-2xl overflow-hidden hover:border-[#1F6AE1]/40 transition-all duration-300 flex flex-col h-full bg-white/5 border border-white/10 shadow-lg"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors z-10" />
                <img 
                  src={post.image} 
                  alt={post.title} 
                  loading="lazy"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3 py-1 rounded-md bg-[#1F6AE1] text-xs font-bold text-white uppercase tracking-wider shadow-md">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center justify-between text-[#94A3B8] text-xs font-medium mb-4">
                  <span>{post.publishDate}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#1F6AE1] transition-colors leading-tight">
                  {post.title}
                </h3>
                
                <p className="text-[#94A3B8] text-sm mb-8 line-clamp-3 flex-grow">
                  {post.shortDescription}
                </p>

                <div className="flex items-center text-[#1F6AE1] font-bold uppercase tracking-wider group-hover:translate-x-3 transition-transform mt-auto">
                  Descubrir la Verdad <ArrowRight className="w-5 h-5 ml-2" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};
