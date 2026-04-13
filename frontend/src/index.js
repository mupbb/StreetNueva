import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import "@/index.css";
import App from "@/App";
import { TermsPage, PrivacyPage } from "@/LegalPages";
import { BlogList } from "@/pages/BlogList";
import { BlogPost } from "@/pages/BlogPost";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/terminos" element={<TermsPage />} />
        <Route path="/privacidad" element={<PrivacyPage />} />
        <Route path="/tips" element={<BlogList />} />
        <Route path="/tips/:slug" element={<BlogPost />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
