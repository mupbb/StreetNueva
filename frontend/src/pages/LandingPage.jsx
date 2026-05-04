import React, { useEffect, Suspense, lazy } from "react";
import { Navbar } from "../components/landing/Navbar";
import { WhatsAppFloat } from "../components/landing/WhatsAppFloat";
import "../App.css";

// Use relative paths to bypass potential alias resolution race conditions
const Hero = lazy(() => import("../components/landing/Hero").then(m => ({ default: m.Hero })));
const TrustBadges = lazy(() => import("../components/landing/TrustBadges").then(m => ({ default: m.TrustBadges })));
const Services = lazy(() => import("../components/landing/Services").then(m => ({ default: m.Services })));
const PricingSection = lazy(() => import("../components/landing/PricingSection").then(m => ({ default: m.PricingSection })));
const QuoteForm = lazy(() => import("../components/landing/QuoteForm").then(m => ({ default: m.QuoteForm })));
const Gallery = lazy(() => import("../components/landing/Gallery").then(m => ({ default: m.Gallery })));
const GoogleReviews = lazy(() => import("../components/landing/GoogleReviews").then(m => ({ default: m.GoogleReviews })));
const CoverageZone = lazy(() => import("../components/landing/CoverageZone").then(m => ({ default: m.CoverageZone })));
const WhyChooseUs = lazy(() => import("../components/landing/WhyChooseUs").then(m => ({ default: m.WhyChooseUs })));
const BlogSection = lazy(() => import("../components/landing/BlogSection").then(m => ({ default: m.BlogSection })));
const CTASection = lazy(() => import("../components/landing/CTASection").then(m => ({ default: m.CTASection })));
const Footer = lazy(() => import("../components/landing/Footer").then(m => ({ default: m.Footer })));
const CarePlans = lazy(() => import("../components/landing/CarePlans").then(m => ({ default: m.CarePlans })));
const PartnersAndSocial = lazy(() => import("../components/landing/PartnersAndSocial").then(m => ({ default: m.PartnersAndSocial })));

const SectionLoader = () => (
  <div className="py-20 flex flex-col items-center justify-center bg-black/50">
    <div className="w-8 h-8 border-2 border-[#1F6AE1] border-t-transparent rounded-full animate-spin mb-4" />
    <p className="text-[#94A3B8] text-sm animate-pulse uppercase tracking-widest">Cargando...</p>
  </div>
);

export function LandingPage() {
  useEffect(() => {
    document.title = "Detallado de Autos a Domicilio en CDMX | Especialistas en Poniente, Santa Fe, Interlomas";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <Navbar />
      <Suspense fallback={<div className="h-screen bg-black" />}>
        <Hero />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <TrustBadges />
        <Services />
        <PricingSection />
        <QuoteForm />
        <CarePlans />
        <Gallery />
        <GoogleReviews />
        <CoverageZone />
        <WhyChooseUs />
        <BlogSection />
        <CTASection />
        <PartnersAndSocial />
        <Footer />
      </Suspense>
      <WhatsAppFloat />
    </div>
  );
}
