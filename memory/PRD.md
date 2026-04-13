# Street Prime Detail - PRD

## Problema Original
Landing page para Street Prime Detail, servicio de detallado de autos a domicilio en CDMX.

## User Personas
- Propietarios de autos en CDMX buscando detallado premium a domicilio
- Residentes de Álvaro Obregón, Santa Fe, San Ángel, Coyoacán y zonas cercanas

## Información de Contacto
- WhatsApp / Tel: 55 7250 2791
- Email: contacto@streetprimedetail.com
- Dirección: Prol. San Diego 110B, San Bartolo Ameyalco, Álvaro Obregón, CDMX, C.P. 01800

## Datos Fiscales
- Nombre: Jorge Alberto Diaz Ruiz
- RFC: DIRJ900125E70

## Implementado

### Frontend (React + Tailwind + Framer Motion)
**Arquitectura modular** (15 componentes + shared + constantes):
- `shared.jsx` - Componentes compartidos (StarRating, SectionHeader) + constantes de animación
- `Navbar` - Barra de navegación fija
- `Hero` - Sección principal con parallax
- `TrustBadges` - 4 indicadores de confianza
- `Services` - 4 cards de servicios
- `PricingSection` - Calculadora (VehicleSelector, PackageCard, UpsellButton)
- `QuoteForm` - Formulario (FormPackageButton, FormUpsellButton)
- `Gallery` - 6 resultados reales
- `GoogleReviews` - Reseñas (ReviewCard, ReviewNavigation)
- `CoverageZone` - Google Maps + zonas
- `WhyChooseUs` - 4 razones
- `CTASection` - CTA final
- `AffiliatedBrands` - Carrusel (Meguiar's, Armor All, Turtle Wax, Pro Elite)
- `SocialLinks` - 6 redes sociales (Facebook, Instagram, Threads, TikTok, LinkedIn, Kick)
- `Footer` - Contacto, legal links
- `WhatsAppFloat` - Botón flotante

**Páginas legales** (React Router):
- `/terminos` - Términos y Condiciones
- `/privacidad` - Política de Privacidad

### Code Quality Fixes Applied
- Hook dependencies: useCallback/useMemo con deps correctas, ESLint comment en use-toast.js
- Stable keys: IDs únicos en lugar de index (badges, services, reasons, zones, reviews)
- Extracted sub-components: StarRating, ReviewCard, PackageCard, VehicleSelector, etc.
- Inline objects: Extraídos a shared.jsx (hoverLiftSmall, viewportOnce, scaleIn, etc.)
- Console statements: Eliminados (Meta event errors silenciados)
- Python type hints: generate_pdfs.py con 100% cobertura

### Backend (FastAPI)
- GET /api/google-reviews
- POST /api/meta-event

### Integraciones
- Meta Pixel + Conversions API
- Google Places API (requiere habilitación)

### Restricciones de Diseño
- Tema oscuro (bg-[#0B0D10]) - NO cambiar
- Espaciado compacto (py-6 a py-10) - NO aumentar

## Arquitectura
```
frontend/src/
├── App.js (~40 líneas)
├── LegalPages.js
├── index.js (React Router)
├── index.css
├── lib/constants.js
└── components/landing/
    ├── shared.jsx (StarRating, SectionHeader, animation constants)
    ├── Navbar.jsx, Hero.jsx, TrustBadges.jsx
    ├── Services.jsx, PricingSection.jsx, QuoteForm.jsx
    ├── Gallery.jsx, GoogleReviews.jsx, CoverageZone.jsx
    ├── WhyChooseUs.jsx, CTASection.jsx
    ├── AffiliatedBrands.jsx, SocialLinks.jsx
    ├── Footer.jsx, WhatsAppFloat.jsx
```

## Backlog
- No hay tareas técnicas pendientes
