import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Phone, Mail, MapPin, FileText } from "lucide-react";
import { IMAGES, WHATSAPP_NUMBER } from "@/lib/constants";

const LegalLayout = ({ title, subtitle, children }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0D10] text-white">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#0B0D10]/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 text-[#94A3B8] hover:text-white transition-colors" data-testid="legal-back-link">
            <ArrowLeft className="w-5 h-5" />
            <img src={IMAGES.logo} alt="Street Prime Detail - Logotipo Detallado Premium" className="h-8 md:h-10" />
          </Link>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#25D366] hover:text-[#25D366]/80 transition-colors font-medium"
            data-testid="legal-whatsapp"
          >
            55 7250 2791
          </a>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-10 md:py-14">
        <div className="mb-8 md:mb-10">
          <div className="flex items-center gap-2 text-[#1F6AE1] text-sm font-semibold tracking-wider mb-3">
            <FileText className="w-4 h-4" />
            {subtitle}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif", textTransform: "uppercase" }}>
            {title}
          </h1>
          <p className="text-[#94A3B8] text-sm mt-3">Última actualización: Abril 2026</p>
        </div>

        <div className="legal-content space-y-8 text-[#C9CDD3] text-sm leading-relaxed">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[#94A3B8] text-xs">
            <p>© {new Date().getFullYear()} Street Prime Detail. Todos los derechos reservados.</p>
            <div className="flex items-center gap-4">
              <Link to="/terminos" className="hover:text-[#1F6AE1] transition-colors" data-testid="legal-footer-terms">Términos y Condiciones</Link>
              <span>•</span>
              <Link to="/privacidad" className="hover:text-[#1F6AE1] transition-colors" data-testid="legal-footer-privacy">Política de Privacidad</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const Section = ({ number, title, children }) => (
  <section>
    <h2 className="text-lg font-bold text-white mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif", textTransform: "uppercase" }}>
      <span className="text-[#1F6AE1]">{number}.</span> {title}
    </h2>
    <div className="space-y-3">{children}</div>
  </section>
);

export const TermsPage = () => {
  useEffect(() => {
    document.title = "Términos y Condiciones | Street Prime Detail";
  }, []);

  return (
    <LegalLayout title="Términos y Condiciones" subtitle="DOCUMENTO LEGAL">
      <Section number="1" title="Identificación del Prestador de Servicios">
        <div className="glass-legal p-5 rounded-xl space-y-1.5">
          <p><strong className="text-white">Nombre:</strong> Jorge Alberto Diaz Ruiz</p>
          <p><strong className="text-white">Nombre Comercial:</strong> Street Prime Detail</p>
          <p><strong className="text-white">RFC:</strong> DIRJ900125E70</p>
          <p><strong className="text-white">Domicilio Fiscal:</strong> Prolongación San Diego 110, Col. San Bartolo Ameyalco, Alcaldía Álvaro Obregón, Ciudad de México, C.P. 01800</p>
          <p><strong className="text-white">Teléfono:</strong> 55 7250 2791</p>
          <p><strong className="text-white">Correo:</strong> contacto@streetprimedetail.com</p>
          <p><strong className="text-white">Actividad:</strong> Prestación de servicios contratados a través de Internet, aplicaciones informáticas y similares.</p>
        </div>
      </Section>

      <Section number="2" title="Aceptación de los Términos">
        <p>Al solicitar cualquier servicio de Street Prime Detail a través de nuestro sitio web, WhatsApp, teléfono u otro medio de comunicación, el cliente acepta íntegramente los presentes Términos y Condiciones. Si no está de acuerdo con alguna de las disposiciones aquí establecidas, le solicitamos abstenerse de contratar nuestros servicios.</p>
      </Section>

      <Section number="3" title="Descripción de los Servicios">
        <p>Street Prime Detail ofrece servicios profesionales de detallado automotriz a domicilio en la Ciudad de México y zona metropolitana, que incluyen, de manera enunciativa mas no limitativa:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Lavado exterior profesional</li>
          <li>Limpieza interior profunda</li>
          <li>Detallado automotriz premium</li>
          <li>Pulido y corrección de pintura</li>
          <li>Tratamiento cerámico</li>
          <li>Servicios extras (descontaminación, hidratación de piel, ozono, etc.)</li>
        </ul>
        <p>Los servicios se ofrecen en tres paquetes principales: Street Clean, Street Detail y Street Deep, cada uno con alcances y precios específicos según el tipo de vehículo.</p>
      </Section>

      <Section number="4" title="Cotización y Precios">
        <p>Los precios publicados en nuestro sitio web son de referencia y pueden variar según las condiciones específicas del vehículo. El precio final será confirmado antes de iniciar el servicio. Los precios incluyen IVA. Street Prime Detail se reserva el derecho de modificar los precios en cualquier momento sin previo aviso, siendo aplicables los precios vigentes al momento de la confirmación del servicio.</p>
      </Section>

      <Section number="5" title="Proceso de Contratación">
        <ol className="list-decimal list-inside space-y-2 ml-2">
          <li>El cliente solicita una cotización a través de nuestro sitio web, WhatsApp o teléfono.</li>
          <li>Street Prime Detail proporciona una cotización basada en la información proporcionada.</li>
          <li>El cliente confirma el servicio y agenda fecha, hora y ubicación.</li>
          <li>El servicio se realiza en el domicilio indicado por el cliente.</li>
          <li>El pago se realiza al término del servicio o según lo acordado.</li>
        </ol>
      </Section>

      <Section number="6" title="Formas de Pago">
        <p>Se aceptan los siguientes métodos de pago:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Efectivo</li>
          <li>Transferencia bancaria</li>
          <li>Tarjeta de débito/crédito (sujeto a disponibilidad del terminal)</li>
        </ul>
        <p>El pago total debe realizarse al concluir el servicio, salvo acuerdo previo por escrito.</p>
      </Section>

      <Section number="7" title="Cancelaciones y Reprogramaciones">
        <p>El cliente puede cancelar o reprogramar su cita sin cargo alguno con un mínimo de <strong className="text-white">12 horas de anticipación</strong>. Las cancelaciones realizadas con menos de 12 horas de anticipación podrán generar un cargo por concepto de gastos operativos equivalente al 20% del valor del servicio cotizado.</p>
        <p>En caso de no presentarse el vehículo en la fecha y hora acordadas sin previo aviso, se considerará como cancelación sin anticipación.</p>
      </Section>

      <Section number="8" title="Garantía del Servicio">
        <p>Street Prime Detail garantiza la calidad de sus servicios. Si el cliente no está satisfecho con el resultado, deberá notificarlo dentro de las <strong className="text-white">24 horas siguientes</strong> a la finalización del servicio. Se realizará una revisión y, de ser procedente, se aplicará una corrección sin costo adicional.</p>
        <p>La garantía no cubre daños preexistentes en el vehículo, condiciones climáticas adversas posteriores al servicio, ni el desgaste natural del tratamiento aplicado.</p>
      </Section>

      <Section number="9" title="Responsabilidad y Limitaciones">
        <p>Street Prime Detail se compromete a tratar cada vehículo con el máximo cuidado y profesionalismo. Sin embargo:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>No nos hacemos responsables por daños preexistentes no reportados antes del servicio.</li>
          <li>No nos hacemos responsables por objetos personales dejados dentro del vehículo.</li>
          <li>La responsabilidad máxima de Street Prime Detail se limita al costo del servicio contratado.</li>
          <li>No nos hacemos responsables por resultados que dependan de las condiciones previas del vehículo (pintura deteriorada, materiales dañados, etc.).</li>
        </ul>
      </Section>

      <Section number="10" title="Requisitos para el Servicio a Domicilio">
        <p>El cliente deberá proporcionar:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Acceso a una toma de agua y electricidad (cuando sea requerido).</li>
          <li>Espacio suficiente y seguro para realizar el servicio.</li>
          <li>Acceso al vehículo en el horario acordado.</li>
        </ul>
        <p>En caso de que las condiciones del lugar no permitan la realización del servicio, este podrá ser reprogramado sin costo.</p>
      </Section>

      <Section number="11" title="Propiedad Intelectual">
        <p>Todos los contenidos del sitio web de Street Prime Detail, incluyendo textos, imágenes, logotipos, diseños y elementos gráficos, son propiedad de Street Prime Detail o se utilizan bajo licencia. Queda prohibida su reproducción, distribución o uso sin autorización expresa por escrito.</p>
      </Section>

      <Section number="12" title="Modificaciones a los Términos">
        <p>Street Prime Detail se reserva el derecho de modificar los presentes Términos y Condiciones en cualquier momento. Las modificaciones serán publicadas en nuestro sitio web y entrarán en vigor a partir de su publicación. El uso continuado de nuestros servicios después de cualquier modificación constituye la aceptación de los nuevos términos.</p>
      </Section>

      <Section number="13" title="Legislación Aplicable y Jurisdicción">
        <p>Los presentes Términos y Condiciones se rigen por las leyes vigentes en los Estados Unidos Mexicanos. Para la resolución de cualquier controversia derivada de los presentes términos, las partes se someten a la jurisdicción de los tribunales competentes de la Ciudad de México, renunciando a cualquier otro fuero que pudiera corresponderles.</p>
      </Section>

      <Section number="14" title="Contacto">
        <p>Para cualquier duda, aclaración o reclamación relacionada con estos Términos y Condiciones:</p>
        <div className="glass-legal p-5 rounded-xl space-y-2 mt-3">
          <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#1F6AE1]" /> <span>55 7250 2791</span></p>
          <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#1F6AE1]" /> <span>contacto@streetprimedetail.com</span></p>
          <p className="flex items-start gap-2"><MapPin className="w-4 h-4 text-[#1F6AE1] mt-0.5" /> <span>Prolongación San Diego 110, Col. San Bartolo Ameyalco, Alcaldía Álvaro Obregón, Ciudad de México, C.P. 01800</span></p>
        </div>
      </Section>
    </LegalLayout>
  );
};

export const PrivacyPage = () => {
  useEffect(() => {
    document.title = "Política de Privacidad | Street Prime Detail";
  }, []);

  return (
    <LegalLayout title="Política de Privacidad" subtitle="AVISO DE PRIVACIDAD">
      <div className="glass-legal p-5 rounded-xl">
        <p>En cumplimiento con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) y su Reglamento, Street Prime Detail, operado por <strong className="text-white">Jorge Alberto Diaz Ruiz</strong> (en adelante "el Responsable"), con domicilio en Prolongación San Diego 110, Col. San Bartolo Ameyalco, Alcaldía Álvaro Obregón, Ciudad de México, C.P. 01800, pone a su disposición el presente Aviso de Privacidad.</p>
      </div>

      <Section number="1" title="Datos Personales que Recabamos">
        <p><strong className="text-white">Datos de identificación:</strong></p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Nombre completo</li>
          <li>Número de teléfono</li>
          <li>Correo electrónico</li>
        </ul>
        <p className="mt-3"><strong className="text-white">Datos del vehículo:</strong></p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Marca, modelo y tipo de vehículo</li>
          <li>Ubicación para el servicio a domicilio</li>
        </ul>
        <p className="mt-3"><strong className="text-white">Datos de navegación (recopilados automáticamente):</strong></p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Dirección IP</li>
          <li>Tipo de navegador y dispositivo</li>
          <li>Páginas visitadas y tiempo de navegación</li>
          <li>Datos de cookies y tecnologías similares (Meta Pixel)</li>
        </ul>
      </Section>

      <Section number="2" title="Finalidades del Tratamiento">
        <p><strong className="text-white">Finalidades primarias (necesarias):</strong></p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Proporcionar los servicios de detallado automotriz solicitados.</li>
          <li>Elaborar cotizaciones personalizadas.</li>
          <li>Coordinar y agendar citas de servicio.</li>
          <li>Contactarlo para dar seguimiento al servicio.</li>
          <li>Emitir comprobantes fiscales cuando sea solicitado.</li>
        </ul>
        <p className="mt-3"><strong className="text-white">Finalidades secundarias (no necesarias):</strong></p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Enviar promociones, ofertas y novedades por WhatsApp o correo electrónico.</li>
          <li>Realizar encuestas de satisfacción.</li>
          <li>Mejorar nuestros servicios y experiencia del usuario.</li>
          <li>Fines estadísticos y de análisis de mercado.</li>
          <li>Publicidad dirigida a través de plataformas de terceros (Meta/Facebook).</li>
        </ul>
        <p className="mt-3">Si no desea que sus datos sean tratados para finalidades secundarias, puede comunicarlo al correo <strong className="text-white">contacto@streetprimedetail.com</strong>.</p>
      </Section>

      <Section number="3" title="Tecnologías de Rastreo (Cookies y Pixel)">
        <p><strong className="text-white">Meta Pixel (Facebook Pixel):</strong> Utilizamos el pixel de Meta para medir la efectividad de nuestra publicidad, optimizar anuncios y crear audiencias personalizadas. Este pixel recopila información sobre su actividad en nuestro sitio web, incluyendo páginas visitadas y acciones realizadas (como enviar formularios de cotización).</p>
        <p className="mt-3"><strong className="text-white">Meta Conversions API (CAPI):</strong> Utilizamos la API de Conversiones de Meta para enviar eventos del servidor de forma segura, lo que nos permite medir con mayor precisión el rendimiento de nuestras campañas publicitarias.</p>
        <p className="mt-3"><strong className="text-white">Cookies funcionales:</strong> Utilizamos cookies estrictamente necesarias para el correcto funcionamiento del sitio web.</p>
        <p className="mt-3">Puede desactivar las cookies a través de la configuración de su navegador. Sin embargo, esto podría afectar la funcionalidad del sitio web.</p>
      </Section>

      <Section number="4" title="Transferencia de Datos">
        <p>Street Prime Detail podrá transferir sus datos personales a los siguientes terceros:</p>
        <ul className="list-disc list-inside space-y-2 ml-2 mt-2">
          <li><strong className="text-white">Meta Platforms, Inc. (Facebook/Instagram):</strong> Para fines publicitarios y de medición de campañas, a través del Meta Pixel y la API de Conversiones.</li>
          <li><strong className="text-white">Google LLC:</strong> A través de Google Maps para la visualización de nuestra ubicación y zona de cobertura.</li>
          <li><strong className="text-white">Proveedores de servicios de pago:</strong> Para el procesamiento de pagos con tarjeta.</li>
        </ul>
        <p className="mt-3">Estas transferencias se realizan con base en el consentimiento otorgado al aceptar los presentes términos y son necesarias para la prestación de nuestros servicios.</p>
      </Section>

      <Section number="5" title="Derechos ARCO">
        <p>Usted tiene derecho a <strong className="text-white">Acceder, Rectificar, Cancelar u Oponerse</strong> al tratamiento de sus datos personales (Derechos ARCO). Para ejercer estos derechos, deberá enviar una solicitud al correo electrónico <strong className="text-white">contacto@streetprimedetail.com</strong> con la siguiente información:</p>
        <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
          <li>Nombre completo del titular.</li>
          <li>Descripción clara del derecho que desea ejercer.</li>
          <li>Documentos que acrediten su identidad (copia de identificación oficial).</li>
          <li>Cualquier documento o información que facilite la localización de sus datos.</li>
        </ul>
        <p className="mt-3">Street Prime Detail responderá su solicitud en un plazo máximo de <strong className="text-white">20 días hábiles</strong> a partir de la recepción de la solicitud completa.</p>
      </Section>

      <Section number="6" title="Revocación del Consentimiento">
        <p>Usted puede revocar su consentimiento para el tratamiento de sus datos personales en cualquier momento, enviando su solicitud al correo <strong className="text-white">contacto@streetprimedetail.com</strong>. La revocación no tendrá efectos retroactivos.</p>
      </Section>

      <Section number="7" title="Medidas de Seguridad">
        <p>Street Prime Detail implementa medidas de seguridad administrativas, técnicas y físicas para proteger sus datos personales contra daño, pérdida, alteración, destrucción o uso, acceso o tratamiento no autorizado, de conformidad con la normatividad aplicable.</p>
      </Section>

      <Section number="8" title="Uso de Imágenes y Testimonios">
        <p>Con el consentimiento previo del cliente, Street Prime Detail podrá utilizar fotografías del vehículo antes y después del servicio con fines promocionales en su sitio web y redes sociales. En ningún caso se publicarán datos personales del cliente sin su autorización expresa.</p>
      </Section>

      <Section number="9" title="Menores de Edad">
        <p>Street Prime Detail no recaba intencionalmente datos personales de menores de edad. Si usted es menor de 18 años, deberá contar con el consentimiento de su padre, madre o tutor para proporcionar sus datos.</p>
      </Section>

      <Section number="10" title="Modificaciones al Aviso de Privacidad">
        <p>Street Prime Detail se reserva el derecho de modificar el presente Aviso de Privacidad en cualquier momento. Las modificaciones serán publicadas en nuestro sitio web. Le recomendamos revisar periódicamente este aviso para estar informado sobre cómo protegemos sus datos.</p>
      </Section>

      <Section number="11" title="Contacto para Asuntos de Privacidad">
        <div className="glass-legal p-5 rounded-xl space-y-2">
          <p><strong className="text-white">Responsable:</strong> Jorge Alberto Diaz Ruiz</p>
          <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#1F6AE1]" /> <span>contacto@streetprimedetail.com</span></p>
          <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#1F6AE1]" /> <span>55 7250 2791</span></p>
          <p className="flex items-start gap-2"><MapPin className="w-4 h-4 text-[#1F6AE1] mt-0.5" /> <span>Prolongación San Diego 110, Col. San Bartolo Ameyalco, Alcaldía Álvaro Obregón, Ciudad de México, C.P. 01800</span></p>
        </div>
      </Section>

      <Section number="12" title="Consentimiento">
        <p>Al proporcionar sus datos personales a través de nuestro sitio web, WhatsApp, teléfono o cualquier otro medio, usted otorga su consentimiento para el tratamiento de sus datos conforme a lo establecido en el presente Aviso de Privacidad.</p>
        <p className="mt-3 text-[#94A3B8] italic">Fecha de entrada en vigor: Abril 2026</p>
      </Section>
    </LegalLayout>
  );
};
