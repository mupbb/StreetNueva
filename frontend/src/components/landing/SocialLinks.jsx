import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/constants";
import { viewportOnce } from "./shared";

const SOCIAL_LINKS = [
  {
    name: "Facebook",
    url: "https://www.facebook.com/share/1DvnZvZDpa/?mibextid=wwXIfr",
    svg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    color: "#1877F2",
    hoverBg: "hover:bg-[#1877F2]/20"
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/streetprimedetail?igsh=MWZ0aDZoZnJpZTY5dg%3D%3D&utm_source=qr",
    svg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
    color: "#E4405F",
    hoverBg: "hover:bg-[#E4405F]/20"
  },
  {
    name: "Threads",
    url: "https://www.threads.com/@streetprimedetail?igshid=NTc4MTIwNjQ2YQ==",
    svg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.59 12c.025 3.086.718 5.496 2.057 7.164 1.432 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.17.408-2.243 1.33-3.023.86-.727 2.058-1.146 3.394-1.19 1.073-.035 2.099.091 3.05.317-.038-.795-.216-1.418-.537-1.873-.425-.604-1.1-.917-2.009-.932h-.048c-.672 0-1.545.228-2.076.768l-1.452-1.382c.865-.908 2.088-1.39 3.536-1.39h.072c1.395.024 2.5.525 3.285 1.49.71.87 1.088 2.074 1.127 3.583.507.27.967.588 1.373.955 1.276 1.156 1.99 2.803 2.07 4.758.026.648-.097 1.63-.576 2.76-.56 1.322-1.49 2.43-2.762 3.297-1.423.97-3.2 1.476-5.279 1.503zm-1.2-8.062c-.61.022-1.14.134-1.533.327-.5.245-.773.59-.75 1.004.048.857.97 1.38 2.216 1.312 1.11-.06 1.965-.479 2.549-1.248.348-.46.588-1.05.727-1.773-.67-.152-1.4-.237-2.17-.237-.345 0-.695.02-1.04.058v.557z"/>
      </svg>
    ),
    color: "#FFFFFF",
    hoverBg: "hover:bg-white/20"
  },
  {
    name: "TikTok",
    url: "https://www.tiktok.com/@street.prime.detail?_r=1&_t=ZS-95RV8EeA5TA",
    svg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
      </svg>
    ),
    color: "#00F2EA",
    hoverBg: "hover:bg-[#00F2EA]/20"
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/company/streetprimedetail/",
    svg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    color: "#0A66C2",
    hoverBg: "hover:bg-[#0A66C2]/20"
  },
  {
    name: "Kick",
    url: "https://kick.com/streetprimedetail",
    svg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M1.333 0C.597 0 0 .597 0 1.333v21.334C0 23.403.597 24 1.333 24h21.334c.736 0 1.333-.597 1.333-1.333V1.333C24 .597 23.403 0 22.667 0H1.333zm4.555 4.8h3.2v4.267L12.355 4.8h4.089l-4.267 5.333L16.444 16h-4.088l-3.268-4.267V16h-3.2V4.8z"/>
      </svg>
    ),
    color: "#53FC18",
    hoverBg: "hover:bg-[#53FC18]/20"
  }
];

export const SocialLinks = () => {
  return (
    <section className="py-8 md:py-10" data-testid="social-links-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="text-center mb-8">
            <span className="text-[#1F6AE1] font-semibold tracking-wider text-sm">SÍGUENOS</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
              Nuestras <span className="text-[#1F6AE1]">Redes Sociales</span>
            </h2>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4 md:gap-6">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group glass-card border border-white/5 rounded-2xl px-6 py-4 flex items-center gap-3 transition-all duration-300 hover:border-white/20 hover:scale-105 ${social.hoverBg}`}
                data-testid={`social-${social.name.toLowerCase()}`}
              >
                <span className="text-[#94A3B8] transition-colors duration-300" style={{ '--brand-color': social.color }}>
                  <span className="social-icon-wrap">{social.svg}</span>
                </span>
                <span className="text-sm font-medium text-[#94A3B8] group-hover:text-white transition-colors">
                  {social.name}
                </span>
              </a>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
