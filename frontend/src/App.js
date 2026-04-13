import { useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import "@/App.css";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { TrustBadges } from "@/components/landing/TrustBadges";
import { Services } from "@/components/landing/Services";
import { PricingSection } from "@/components/landing/PricingSection";
import { QuoteForm } from "@/components/landing/QuoteForm";
import { Gallery } from "@/components/landing/Gallery";
import { GoogleReviews } from "@/components/landing/GoogleReviews";
import { CoverageZone } from "@/components/landing/CoverageZone";
import { WhyChooseUs } from "@/components/landing/WhyChooseUs";
import { BlogSection } from "@/components/landing/BlogSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";
import { WhatsAppFloat } from "@/components/landing/WhatsAppFloat";
import { CarePlans } from "@/components/landing/CarePlans";
import { PartnersAndSocial } from "@/components/landing/PartnersAndSocial";

import { TermsPage, PrivacyPage } from "@/LegalPages";

const LandingPage = () => {
  useEffect(() => {
    document.title = "Street Prime Detail | Detallado Automotriz a Domicilio CDMX";
  }, []);

  return (
    <div className="grain-overlay">
      <Navbar />
      <Hero />
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
      <WhatsAppFloat />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/terminos" element={<TermsPage />} />
        <Route path="/privacidad" element={<PrivacyPage />} />
      </Routes>
    </Router>
  );
}

export default App;
