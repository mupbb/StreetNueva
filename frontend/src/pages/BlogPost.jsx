import { useEffect } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, Clock, Calendar, CheckCircle2 } from "lucide-react";
import { blogPosts } from "@/data/blogData";
import { useSEO } from "@/hooks/useSEO";
import { Footer } from "@/components/landing/Footer";

const LOGO_URL = "https://customer-assets.emergentagent.com/job_auto-detail/artifacts/bkbn2cvl_LOGO%20TRANSPARENTE.png";
const WHATSAPP_NUMBER = "5572502791";

// Simple Markdown parser for our specific content
const renderContent = (text) => {
  return text.split('\n').map((line, index) => {
    if (line.startsWith('### ')) {
      return <h3 key={index} className="text-xl font-bold text-white mt-8 mb-4">{line.replace('### ', '')}</h3>;
    }
    if (line.startsWith('## ')) {
      return <h2 key={index} className="text-2xl font-bold text-[#1F6AE1] mt-10 mb-5" style={{ fontFamily: "'Barlow Condensed', sans-serif", textTransform: "uppercase" }}>{line.replace('## ', '')}</h2>;
    }
    if (line.startsWith('* ')) {
      return (
        <li key={index} className="flex items-start gap-3 mb-2 ml-4">
          <CheckCircle2 className="w-5 h-5 text-[#1F6AE1] shrink-0 mt-0.5" />
          <span><strong dangerouslySetInnerHTML={{ __html: line.replace('* ', '').replace(/\*\*(.*?)\*\*/g, '<span class="text-white font-bold">$1</span>') }} /></span>
        </li>
      );
    }
    if (line.trim() === '') return <br key={index} />;
    
    // Replace **text** with bold
    const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>').replace(/\*(.*?)\*/g, '<em class="text-white/90">$1</em>');
    
    return <p key={index} className="mb-4 text-[#94A3B8] leading-relaxed" dangerouslySetInnerHTML={{ __html: formattedLine }} />;
  });
};

export const BlogPost = () => {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // SEO Injection Hook
  useSEO({
    title: post ? post.seo.metaTitle : "Artículo no encontrado | Street Prime Detail",
    description: post ? post.seo.metaDescription : "",
    keywords: post ? post.seo.keywords : "",
    url: `/tips/${slug}`,
    image: post ? post.image : "",
    type: "article",
    publishDate: post ? post.publishDate : ""
  });

  if (!post) {
    return <Navigate to="/tips" replace />;
  }

  const whatsappMessage = encodeURIComponent(`Hola, acabo de leer el artículo de "${post.title}" y me di cuenta que necesito sus servicios. Quiero reservar un espacio exclusivo.`);

  return (
    <div className="min-h-screen bg-[#0B0D10] text-[#C9CDD3] selection:bg-[#1F6AE1]/30">
      {/* Absolute Glow Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-[#1F6AE1]/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-white/5 bg-[#0B0D10]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 text-[#94A3B8] hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden md:inline font-semibold">Volver a Home</span>
          </Link>
          <img src={LOGO_URL} alt="Street Prime Detail Logo" className="h-8" />
        </div>
      </header>

      {/* Article Content */}
      <main className="relative z-10 w-full max-w-3xl mx-auto px-6 py-12 md:py-20">
        <article itemScope itemType="https://schema.org/Article">
          
          {/* Category & Breadcrumbs */}
          <div className="flex items-center justify-between mb-8">
            <span className="px-3 py-1 rounded-md bg-[#1F6AE1]/10 border border-[#1F6AE1]/30 text-[#1F6AE1] text-xs font-bold uppercase tracking-wider">
              {post.category}
            </span>
            <div className="flex items-center gap-4 text-[#94A3B8] text-xs font-medium">
              <div className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {post.publishDate}</div>
              <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readTime}</div>
            </div>
          </div>

          {/* Headline */}
          <h1 itemProp="headline" className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif", textTransform: "uppercase" }}>
            {post.title}
          </h1>
          
          <p className="text-lg text-[#94A3B8] mb-10 border-l-4 border-[#1F6AE1] pl-4 italic">
            {post.shortDescription}
          </p>

          {/* Featured Image */}
          <div className="w-full h-[400px] rounded-2xl overflow-hidden mb-12 shadow-[0_0_40px_rgba(31,106,225,0.15)] border border-white/10">
            <img 
              itemProp="image"
              src={post.image} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Body */}
          <div itemProp="articleBody" className="text-base md:text-lg">
            {renderContent(post.content)}
          </div>

          {/* CTA Inject */}
          <div className="mt-16 bg-gradient-to-br from-[#0c1220] to-[#0B0D10] border border-[#1F6AE1]/30 p-8 md:p-12 rounded-2xl text-center shadow-[0_0_50px_rgba(31,106,225,0.1)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#1F6AE1]/10 rounded-full blur-[80px]" />
            <h3 className="text-2xl font-bold text-white mb-4 relative z-10" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              LA EXCLUSIVIDAD NO ADMITE EXCUSAS.
            </h3>
            <p className="text-[#94A3B8] mb-8 relative z-10">
              {post.callToAction}
            </p>
            <a 
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="relative z-10 inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20b858] text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider transition-all hover:scale-105 shadow-[0_10px_25px_rgba(37,211,102,0.3)]"
            >
              💬 Agendar Evaluación por WhatsApp
            </a>
          </div>

        </article>
      </main>

      <Footer />
    </div>
  );
};
