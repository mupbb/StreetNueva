import { MessageCircle, Phone, Mail, MapPin, Clock, FileText, ExternalLink } from "lucide-react";
import { IMAGES, WHATSAPP_LINK, WHATSAPP_NUMBER } from "@/lib/constants";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-10 md:py-12 border-t border-white/5" data-testid="footer-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <img src={IMAGES.logo} alt="Street Prime Detail" className="h-16 mb-4" />
            <p className="text-[#94A3B8] text-sm mb-4">
              Servicio profesional de detallado y lavado de autos a domicilio en CDMX.
            </p>
            <div className="flex items-center gap-3">
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="benefit-icon p-2 rounded-lg hover:bg-[#25D366]/20 transition-colors" data-testid="footer-whatsapp-link">
                <MessageCircle className="w-5 h-5 text-[#25D366]" />
              </a>
              <a href={`tel:${WHATSAPP_NUMBER}`} className="benefit-icon p-2 rounded-lg hover:bg-[#1F6AE1]/20 transition-colors" data-testid="footer-phone-link">
                <Phone className="w-5 h-5 text-[#1F6AE1]" />
              </a>
            </div>
          </div>

          {/* Paquetes */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Secciones</h4>
            <ul className="space-y-2 text-[#94A3B8] text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Inicio</a></li>
              <li><a href="#/tips" className="hover:text-white font-bold text-[#1F6AE1] transition-colors">Blog / Tips</a></li>
              <li>Street Clean - $499</li>
              <li>Street Detail - $899</li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Servicios</h4>
            <ul className="space-y-2 text-[#94A3B8] text-sm">
              <li>Lavado Exterior Profesional</li>
              <li>Limpieza Interior Profunda</li>
              <li>Detallado Automotriz Premium</li>
              <li>Pulido y Corrección de Pintura</li>
              <li>Tratamiento Cerámico</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Contacto</h4>
            <ul className="space-y-3 text-[#94A3B8] text-sm">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#1F6AE1] mt-0.5 flex-shrink-0" />
                <a href={`tel:${WHATSAPP_NUMBER}`} className="hover:text-white transition-colors">55 7250 2791</a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-[#1F6AE1] mt-0.5 flex-shrink-0" />
                <a href="mailto:contacto@streetprimedetail.com" className="hover:text-white transition-colors">contacto@streetprimedetail.com</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#1F6AE1] mt-0.5 flex-shrink-0" />
                <span>Prol. San Diego 110B, San Bartolo Ameyalco, Álvaro Obregón, CDMX</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#1F6AE1] mt-0.5 flex-shrink-0" />
                <span>Abre a las 10:00 a.m.</span>
              </li>
            </ul>

            {/* Legal Links */}
            <div className="mt-5 pt-4 border-t border-white/5">
              <div className="flex flex-col gap-2">
                <a href="#/terminos" className="flex items-center gap-2 text-[#94A3B8] text-xs hover:text-[#1F6AE1] transition-colors" data-testid="footer-terms-link">
                  <FileText className="w-3.5 h-3.5" />
                  Términos y Condiciones
                </a>
                <a href="#/privacidad" className="flex items-center gap-2 text-[#94A3B8] text-xs hover:text-[#1F6AE1] transition-colors" data-testid="footer-privacy-link">
                  <FileText className="w-3.5 h-3.5" />
                  Política de Privacidad
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Keywords */}
        <div className="section-divider mb-8" />
        <div className="text-center mb-8">
          <p className="text-xs text-[#94A3B8]/60">
            detallado de autos a domicilio CDMX • lavado de autos a domicilio Álvaro Obregón • 
            detailing automotriz a domicilio • limpieza interior de autos CDMX • 
            lavado profesional de autos CDMX • pulido de pintura • tratamiento cerámico automotriz
          </p>
        </div>

        {/* Copyright & Legal */}
        <div className="text-center space-y-2">
          <p className="text-sm text-[#94A3B8]">
            © {currentYear} Street Prime Detail. Todos los derechos reservados.
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-[#94A3B8]/60">
            <a href="#/terminos" className="hover:text-[#1F6AE1] transition-colors" data-testid="footer-terms-bottom-link">
              Términos y Condiciones
            </a>
            <span>•</span>
            <a href="#/privacidad" className="hover:text-[#1F6AE1] transition-colors" data-testid="footer-privacy-bottom-link">
              Política de Privacidad
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
