import { Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { BlogList } from "./pages/BlogList";
import { BlogPost } from "./pages/BlogPost";
import { TermsPage, PrivacyPage } from "./LegalPages";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/tips" element={<BlogList />} />
      <Route path="/tips/:slug" element={<BlogPost />} />
      <Route path="/terminos" element={<TermsPage />} />
      <Route path="/privacidad" element={<PrivacyPage />} />
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
}
