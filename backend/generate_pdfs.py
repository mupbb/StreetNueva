"""
Generate Terms & Conditions and Privacy Policy PDFs for Street Prime Detail
"""
from fpdf import FPDF


class LegalPDF(FPDF):
    def __init__(self, title_text: str) -> None:
        super().__init__()
        self.title_text = title_text

    def header(self) -> None:
        self.set_font('Helvetica', 'B', 11)
        self.set_text_color(31, 106, 225)
        self.cell(0, 8, 'STREET PRIME DETAIL', 0, 0, 'L')
        self.ln(4)
        self.set_draw_color(31, 106, 225)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(6)

    def footer(self) -> None:
        self.set_y(-20)
        self.set_draw_color(200, 200, 200)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(3)
        self.set_font('Helvetica', '', 7)
        self.set_text_color(128, 128, 128)
        self.cell(0, 5, 'Street Prime Detail | Jorge Alberto Diaz Ruiz | RFC: DIRJ900125E70', 0, 1, 'C')
        self.cell(0, 5, f'Pagina {self.page_no()}/{{nb}}', 0, 0, 'C')

    def section_header(self, text: str) -> None:
        self.set_font('Helvetica', 'B', 10)
        self.set_text_color(31, 106, 225)
        self.cell(0, 8, text, 0, 1, 'L')
        self.ln(1)

    def section_body(self, body: str) -> None:
        self.set_font('Helvetica', '', 9)
        self.set_text_color(50, 50, 50)
        self.multi_cell(0, 5, body)
        self.ln(4)

    def add_title_page(self, title: str) -> None:
        self.alias_nb_pages()
        self.add_page()
        self.set_auto_page_break(auto=True, margin=25)
        self.set_font('Helvetica', 'B', 18)
        self.set_text_color(11, 13, 16)
        self.cell(0, 12, title, 0, 1, 'C')
        self.set_font('Helvetica', '', 9)
        self.set_text_color(128, 128, 128)
        self.cell(0, 6, 'Ultima actualizacion: Abril 2026', 0, 1, 'C')
        self.ln(8)

    def add_sections(self, sections: list[tuple[str, str]]) -> None:
        for title, body in sections:
            self.section_header(title)
            self.section_body(body)


TERMS_SECTIONS: list[tuple[str, str]] = [
    ("1. IDENTIFICACION DEL PRESTADOR DE SERVICIOS",
     "Nombre o Razon Social: Jorge Alberto Diaz Ruiz\n"
     "Nombre Comercial: Street Prime Detail\n"
     "RFC: DIRJ900125E70\n"
     "Domicilio Fiscal: Prolongacion San Diego 110, Col. San Bartolo Ameyalco, Alcaldia Alvaro Obregon, Ciudad de Mexico, C.P. 01800\n"
     "Telefono de Contacto: 55 7250 2791\n"
     "Correo Electronico: contacto@streetprimedetail.com\n"
     "Actividad Economica: Prestacion de servicios contratados a traves de Internet, aplicaciones informaticas y similares."),
    ("2. ACEPTACION DE LOS TERMINOS",
     "Al solicitar cualquier servicio de Street Prime Detail a traves de nuestro sitio web, WhatsApp, telefono u otro medio de comunicacion, el cliente acepta integramente los presentes Terminos y Condiciones. Si no esta de acuerdo con alguna de las disposiciones aqui establecidas, le solicitamos abstenerse de contratar nuestros servicios."),
    ("3. DESCRIPCION DE LOS SERVICIOS",
     "Street Prime Detail ofrece servicios profesionales de detallado automotriz a domicilio en la Ciudad de Mexico y zona metropolitana, que incluyen, de manera enunciativa mas no limitativa:\n\n"
     "- Lavado exterior profesional\n- Limpieza interior profunda\n- Detallado automotriz premium\n- Pulido y correccion de pintura\n- Tratamiento ceramico\n- Servicios extras (descontaminacion, hidratacion de piel, ozono, etc.)\n\n"
     "Los servicios se ofrecen en tres paquetes principales: Street Clean, Street Detail y Street Deep, cada uno con alcances y precios especificos segun el tipo de vehiculo."),
    ("4. COTIZACION Y PRECIOS",
     "Los precios publicados en nuestro sitio web son de referencia y pueden variar segun las condiciones especificas del vehiculo. El precio final sera confirmado antes de iniciar el servicio. Los precios incluyen IVA. Street Prime Detail se reserva el derecho de modificar los precios en cualquier momento sin previo aviso, siendo aplicables los precios vigentes al momento de la confirmacion del servicio."),
    ("5. PROCESO DE CONTRATACION",
     "1. El cliente solicita una cotizacion a traves de nuestro sitio web, WhatsApp o telefono.\n"
     "2. Street Prime Detail proporciona una cotizacion basada en la informacion proporcionada.\n"
     "3. El cliente confirma el servicio y agenda fecha, hora y ubicacion.\n"
     "4. El servicio se realiza en el domicilio indicado por el cliente.\n"
     "5. El pago se realiza al termino del servicio o segun lo acordado."),
    ("6. FORMAS DE PAGO",
     "Se aceptan los siguientes metodos de pago:\n- Efectivo\n- Transferencia bancaria\n- Tarjeta de debito/credito (sujeto a disponibilidad del terminal)\n\nEl pago total debe realizarse al concluir el servicio, salvo acuerdo previo por escrito."),
    ("7. CANCELACIONES Y REPROGRAMACIONES",
     "El cliente puede cancelar o reprogramar su cita sin cargo alguno con un minimo de 12 horas de anticipacion. Las cancelaciones realizadas con menos de 12 horas de anticipacion podran generar un cargo por concepto de gastos operativos equivalente al 20% del valor del servicio cotizado. En caso de no presentarse el vehiculo en la fecha y hora acordadas sin previo aviso, se considerara como cancelacion sin anticipacion."),
    ("8. GARANTIA DEL SERVICIO",
     "Street Prime Detail garantiza la calidad de sus servicios. Si el cliente no esta satisfecho con el resultado, debera notificarlo dentro de las 24 horas siguientes a la finalizacion del servicio. Se realizara una revision y, de ser procedente, se aplicara una correccion sin costo adicional. La garantia no cubre danos preexistentes en el vehiculo, condiciones climaticas adversas posteriores al servicio, ni el desgaste natural del tratamiento aplicado."),
    ("9. RESPONSABILIDAD Y LIMITACIONES",
     "Street Prime Detail se compromete a tratar cada vehiculo con el maximo cuidado y profesionalismo. Sin embargo:\n\n"
     "- No nos hacemos responsables por danos preexistentes no reportados antes del servicio.\n- No nos hacemos responsables por objetos personales dejados dentro del vehiculo.\n- La responsabilidad maxima de Street Prime Detail se limita al costo del servicio contratado.\n- No nos hacemos responsables por resultados que dependan de las condiciones previas del vehiculo (pintura deteriorada, materiales danados, etc.)."),
    ("10. REQUISITOS PARA EL SERVICIO A DOMICILIO",
     "El cliente debera proporcionar:\n- Acceso a una toma de agua y electricidad (cuando sea requerido).\n- Espacio suficiente y seguro para realizar el servicio.\n- Acceso al vehiculo en el horario acordado.\n\nEn caso de que las condiciones del lugar no permitan la realizacion del servicio, este podra ser reprogramado sin costo."),
    ("11. PROPIEDAD INTELECTUAL",
     "Todos los contenidos del sitio web de Street Prime Detail, incluyendo textos, imagenes, logotipos, disenos y elementos graficos, son propiedad de Street Prime Detail o se utilizan bajo licencia. Queda prohibida su reproduccion, distribucion o uso sin autorizacion expresa por escrito."),
    ("12. MODIFICACIONES A LOS TERMINOS",
     "Street Prime Detail se reserva el derecho de modificar los presentes Terminos y Condiciones en cualquier momento. Las modificaciones seran publicadas en nuestro sitio web y entraran en vigor a partir de su publicacion. El uso continuado de nuestros servicios despues de cualquier modificacion constituye la aceptacion de los nuevos terminos."),
    ("13. LEGISLACION APLICABLE Y JURISDICCION",
     "Los presentes Terminos y Condiciones se rigen por las leyes vigentes en los Estados Unidos Mexicanos. Para la resolucion de cualquier controversia derivada de los presentes terminos, las partes se someten a la jurisdiccion de los tribunales competentes de la Ciudad de Mexico, renunciando a cualquier otro fuero que pudiera corresponderles."),
    ("14. CONTACTO",
     "Para cualquier duda, aclaracion o reclamacion relacionada con estos Terminos y Condiciones, el cliente puede comunicarse a:\n\n"
     "Telefono: 55 7250 2791\nCorreo: contacto@streetprimedetail.com\nDomicilio: Prolongacion San Diego 110, Col. San Bartolo Ameyalco, Alcaldia Alvaro Obregon, Ciudad de Mexico, C.P. 01800")
]

PRIVACY_INTRO: str = (
    "En cumplimiento con la Ley Federal de Proteccion de Datos Personales en Posesion de los Particulares (LFPDPPP) "
    "y su Reglamento, Street Prime Detail, operado por Jorge Alberto Diaz Ruiz (en adelante \"el Responsable\"), "
    "con domicilio en Prolongacion San Diego 110, Col. San Bartolo Ameyalco, Alcaldia Alvaro Obregon, Ciudad de Mexico, "
    "C.P. 01800, pone a su disposicion el presente Aviso de Privacidad."
)

PRIVACY_SECTIONS: list[tuple[str, str]] = [
    ("1. DATOS PERSONALES QUE RECABAMOS",
     "Street Prime Detail podra recabar los siguientes datos personales:\n\nDatos de identificacion:\n- Nombre completo\n- Numero de telefono\n- Correo electronico\n\nDatos del vehiculo:\n- Marca, modelo y tipo de vehiculo\n- Ubicacion para el servicio a domicilio\n\nDatos de navegacion (recopilados automaticamente):\n- Direccion IP\n- Tipo de navegador y dispositivo\n- Paginas visitadas y tiempo de navegacion\n- Datos de cookies y tecnologias similares (Meta Pixel)"),
    ("2. FINALIDADES DEL TRATAMIENTO",
     "Sus datos personales seran utilizados para las siguientes finalidades primarias (necesarias):\n\n- Proporcionar los servicios de detallado automotriz solicitados.\n- Elaborar cotizaciones personalizadas.\n- Coordinar y agendar citas de servicio.\n- Contactarlo para dar seguimiento al servicio.\n- Emitir comprobantes fiscales cuando sea solicitado.\n\nFinalidades secundarias (no necesarias):\n\n- Enviar promociones, ofertas y novedades por WhatsApp o correo electronico.\n- Realizar encuestas de satisfaccion.\n- Mejorar nuestros servicios y experiencia del usuario.\n- Fines estadisticos y de analisis de mercado.\n- Publicidad dirigida a traves de plataformas de terceros (Meta/Facebook).\n\nSi no desea que sus datos sean tratados para finalidades secundarias, puede comunicarlo al correo contacto@streetprimedetail.com."),
    ("3. TECNOLOGIAS DE RASTREO (COOKIES Y PIXEL)",
     "Nuestro sitio web utiliza las siguientes tecnologias de rastreo:\n\nMeta Pixel (Facebook Pixel): Utilizamos el pixel de Meta para medir la efectividad de nuestra publicidad, optimizar anuncios y crear audiencias personalizadas.\n\nMeta Conversions API (CAPI): Utilizamos la API de Conversiones de Meta para enviar eventos del servidor de forma segura.\n\nCookies funcionales: Utilizamos cookies estrictamente necesarias para el correcto funcionamiento del sitio web.\n\nPuede desactivar las cookies a traves de la configuracion de su navegador."),
    ("4. TRANSFERENCIA DE DATOS",
     "Street Prime Detail podra transferir sus datos personales a los siguientes terceros:\n\n- Meta Platforms, Inc. (Facebook/Instagram): Para fines publicitarios y de medicion de campanas.\n- Google LLC: A traves de Google Maps para la visualizacion de nuestra ubicacion y zona de cobertura.\n- Proveedores de servicios de pago: Para el procesamiento de pagos con tarjeta.\n\nEstas transferencias se realizan con base en el consentimiento otorgado al aceptar los presentes terminos."),
    ("5. DERECHOS ARCO",
     "Usted tiene derecho a Acceder, Rectificar, Cancelar u Oponerse al tratamiento de sus datos personales (Derechos ARCO). Para ejercer estos derechos, debera enviar una solicitud al correo electronico contacto@streetprimedetail.com con la siguiente informacion:\n\n- Nombre completo del titular.\n- Descripcion clara del derecho que desea ejercer.\n- Documentos que acrediten su identidad.\n- Cualquier documento o informacion que facilite la localizacion de sus datos.\n\nStreet Prime Detail respondera su solicitud en un plazo maximo de 20 dias habiles."),
    ("6. REVOCACION DEL CONSENTIMIENTO",
     "Usted puede revocar su consentimiento para el tratamiento de sus datos personales en cualquier momento, enviando su solicitud al correo contacto@streetprimedetail.com. La revocacion no tendra efectos retroactivos."),
    ("7. MEDIDAS DE SEGURIDAD",
     "Street Prime Detail implementa medidas de seguridad administrativas, tecnicas y fisicas para proteger sus datos personales contra dano, perdida, alteracion, destruccion o uso, acceso o tratamiento no autorizado."),
    ("8. USO DE IMAGENES Y TESTIMONIOS",
     "Con el consentimiento previo del cliente, Street Prime Detail podra utilizar fotografias del vehiculo antes y despues del servicio con fines promocionales en su sitio web y redes sociales."),
    ("9. MENORES DE EDAD",
     "Street Prime Detail no recaba intencionalmente datos personales de menores de edad."),
    ("10. MODIFICACIONES AL AVISO DE PRIVACIDAD",
     "Street Prime Detail se reserva el derecho de modificar el presente Aviso de Privacidad en cualquier momento. Las modificaciones seran publicadas en nuestro sitio web."),
    ("11. CONTACTO PARA ASUNTOS DE PRIVACIDAD",
     "Responsable: Jorge Alberto Diaz Ruiz\nCorreo: contacto@streetprimedetail.com\nTelefono: 55 7250 2791\nDomicilio: Prolongacion San Diego 110, Col. San Bartolo Ameyalco, Alcaldia Alvaro Obregon, Ciudad de Mexico, C.P. 01800"),
    ("12. CONSENTIMIENTO",
     "Al proporcionar sus datos personales a traves de nuestro sitio web, WhatsApp, telefono o cualquier otro medio, usted otorga su consentimiento para el tratamiento de sus datos conforme a lo establecido en el presente Aviso de Privacidad.\n\nFecha de entrada en vigor: Abril 2026")
]


def generate_terms(output_path: str = "/app/frontend/public/docs/terminos-y-condiciones.pdf") -> None:
    pdf = LegalPDF("Terminos y Condiciones")
    pdf.add_title_page("TERMINOS Y CONDICIONES")
    pdf.add_sections(TERMS_SECTIONS)
    pdf.output(output_path)
    print(f"Generated: {output_path}")


def generate_privacy(output_path: str = "/app/frontend/public/docs/politica-de-privacidad.pdf") -> None:
    pdf = LegalPDF("Politica de Privacidad")
    pdf.add_title_page("POLITICA DE PRIVACIDAD")
    pdf.section_body(PRIVACY_INTRO)
    pdf.add_sections(PRIVACY_SECTIONS)
    pdf.output(output_path)
    print(f"Generated: {output_path}")


if __name__ == "__main__":
    generate_terms()
    generate_privacy()
    print("Both PDFs generated successfully!")
