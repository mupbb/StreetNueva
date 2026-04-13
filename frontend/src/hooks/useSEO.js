import { useEffect } from 'react';

export const useSEO = ({ title, description, keywords, url, image, type = 'website', publishDate }) => {
  useEffect(() => {
    // 1. Update Title
    document.title = title || "Street Prime Detail | Detallado Automotriz CDMX";

    // 2. Helper to set/update meta tags
    const setMetaTag = (attr, key, content) => {
      if (!content) return;
      let element = document.querySelector(`meta[${attr}="${key}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Standard Meta
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', keywords);

    // Open Graph
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', type);
    if (url) setMetaTag('property', 'og:url', `https://streetprimedetail.com${url}`);
    if (image) setMetaTag('property', 'og:image', `https://streetprimedetail.com${image}`);

    // Canonical
    let canonical = document.querySelector("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `https://streetprimedetail.com${url || ''}`);

    // 3. Structured Data JSON-LD
    let script = document.querySelector('#seo-schema');
    if (!script) {
      script = document.createElement('script');
      script.id = 'seo-schema';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    // Default LocalBusiness Schema
    const baseSchema = {
      "@context": "https://schema.org",
      "@type": "AutoRepair",
      "name": "Street Prime Detail",
      "image": "https://customer-assets.emergentagent.com/job_auto-detail/artifacts/vryh810h_BANNER%201.png",
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Prol. San Diego 110B, San Bartolo Ameyalco",
        "addressLocality": "Álvaro Obregón",
        "addressRegion": "Ciudad de México",
        "postalCode": "01800",
        "addressCountry": "MX"
      }
    };

    // If it's an article, provide Article Schema
    if (type === 'article') {
      const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "image": `https://streetprimedetail.com${image}`,
        "datePublished": publishDate,
        "dateModified": publishDate,
        "author": {
          "@type": "Organization",
          "name": "Street Prime Detail"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Street Prime Detail",
          "logo": {
            "@type": "ImageObject",
            "url": "https://customer-assets.emergentagent.com/job_auto-detail/artifacts/vryh810h_BANNER%201.png"
          }
        },
        "description": description
      };
      script.innerHTML = JSON.stringify([baseSchema, articleSchema]);
    } else {
      script.innerHTML = JSON.stringify(baseSchema);
    }

    // Cleanup on unmount
    return () => {
      // In a real SPA we might keep some defaults, but we leave the latest applied.
    };
  }, [title, description, keywords, url, image, type, publishDate]);
};
