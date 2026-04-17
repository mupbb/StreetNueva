// Assets
export const IMAGES = {
  logo: "/assets/landing/logo-official.png",
  hero: "/assets/landing/hero-official.png",
  service1: "/assets/landing/service-exterior.jpg",
  service2: "/assets/landing/service-interior.jpg",
  service3: "/assets/landing/service-premium.jpg",
  whyUs: "/assets/landing/service-domicilio.jpg",
  paquete1: "/assets/landing/package-exterior.png",
  paquete2: "/assets/landing/package-interior.png",
  paquete3: "/assets/landing/package-premium.png",
  extras: "/assets/landing/banner-extras.png",
  compareBefore: "/assets/landing/compare-before.png",
  compareAfter: "/assets/landing/compare-after.png",
  bitcoin_logo: "/assets/landing/bitcoin-logo.png",
  bitso_qr: "/assets/payments/bitso.jpg",
  bybit_qr: "/assets/payments/bybit.jpg",
  phantom_qr: "/assets/payments/phantom.jpg"
};

export const PARTNER_BRANDS = [
  { id: 'meguiars', name: "Meguiar's", logo: "/assets/brands/meguiars.png" },
  { id: 'armorall', name: "Armor All", logo: "/assets/brands/armorall.png" },
  { id: 'turtlewax', name: "Turtle Wax", logo: "/assets/brands/turtlewax.png" },
  { id: 'proelite', name: "Pro Elite", logo: "/assets/brands/proelite.png" }
];

export const SOCIAL_LINKS = [
  { id: 'facebook', name: 'Facebook', url: 'https://www.facebook.com/share/1DvnZvZDpa/?mibextid=wwXIfr' },
  { id: 'instagram', name: 'Instagram', url: 'https://www.instagram.com/streetprimedetail?igsh=MWZ0aDZoZnJpZTY5dg%3D%3D&utm_source=qr' },
  { id: 'threads', name: 'Threads', url: 'https://www.threads.com/@streetprimedetail?igshid=NTc4MTIwNjQ2YQ==' },
  { id: 'tiktok', name: 'TikTok', url: 'https://www.tiktok.com/@street.prime.detail?_r=1&_t=ZS-95RV8EeA5TA' },
  { id: 'linkedin', name: 'LinkedIn', url: 'https://www.linkedin.com/company/streetprimedetail/' },
  { id: 'kick', name: 'Kick', url: 'https://kick.com/streetprimedetail' }
];

export const CRYPTO = {
  phantom_wallet: "D2XFfeAzbHDCoD45KANnqwQNUkZ4VXX97aeunG6md3F",
  solana_pay_link: "solana:D2XFfeAzbHDCoD45KANnqwQNUkZ4VXX97aeunG6md3F?label=Street%20Prime%20Detail&message=Detallado%20Automotriz%20Premium"
};

export const WHATSAPP_NUMBER = "5572502791";
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=Hola,%20me%20interesa%20el%20servicio%20de%20detallado`;
export const GOOGLE_MAPS_LINK = "https://maps.app.goo.gl/aEgjYexBhbJs72g76";
export const WAZE_LINK = "https://waze.com/ul?ll=19.344403,-99.254131&navigate=yes";
export const GOOGLE_MAPS_REVIEW_LINK = "https://g.page/r/CZnxgf7IqHw1EAI/review";

// Pricing Data
export const VEHICLE_TYPES = [
  { id: 'auto_chico', name: 'Auto chico', icon: 'car-sm' },
  { id: 'auto_mediano', name: 'Auto mediano', icon: 'car-md' },
  { id: 'auto_grande', name: 'Auto grande', icon: 'car-lg' },
  { id: 'suv_chica', name: 'SUV chica', icon: 'suv-sm' },
  { id: 'suv_grande', name: 'SUV grande', icon: 'suv-lg' },
  { id: 'camioneta_larga', name: 'Camioneta larga', icon: 'truck-lg' },
  { id: 'camioneta_extra', name: 'Camioneta extra larga', icon: 'truck-xl' }
];

export const PACKAGES = [
  {
    id: 'street_clean',
    name: 'Street Clean',
    subtitle: 'Limpieza esencial bien hecha',
    color: '#25D366',
    image: IMAGES.paquete1,
    altText: "Lavado Exterior Profesional - Limpieza a detalle de rines y llantas con productos Armor All",
    prices: {
      auto_chico: 499, auto_mediano: 549, auto_grande: 599,
      suv_chica: 649, suv_grande: 699, camioneta_larga: 799, camioneta_extra: 899
    },
    features: ['Lavado exterior manual', 'Limpieza de rines y llantas', 'Aspirado interior', 'Limpieza básica de tablero', 'Limpieza de cristales']
  },
  {
    id: 'street_detail',
    name: 'Street Detail',
    subtitle: 'Limpieza superior y detallado',
    color: '#FFB800',
    image: IMAGES.paquete2,
    altText: "Limpieza Interior Profunda - Cuidado y protección de vestiduras de piel con tecnología Armor All",
    prices: {
      auto_chico: 899, auto_mediano: 999, auto_grande: 1099,
      suv_chica: 1199, suv_grande: 1299, camioneta_larga: 1499, camioneta_extra: 1699
    },
    features: ['Lavado exterior a profundidad', 'Limpieza y aspirado profundo', 'Pulido de pintura a 2 pasos', 'Aplicación de cera', 'Limpieza de rines y cristales']
  },
  {
    id: 'street_deep',
    name: 'Street Deep',
    subtitle: 'Detailing completo profesional',
    color: '#1F6AE1',
    image: IMAGES.paquete3,
    altText: "Detallado Automotriz Premium - Corrección de pintura y protección cerámica profesional para vehículos de alta gama",
    prices: {
      auto_chico: 1799, auto_mediano: 1999, auto_grande: 2199,
      suv_chica: 2399, suv_grande: 2699, camioneta_larga: 2999, camioneta_extra: 3399
    },
    features: ['Lavado exterior a profundidad', 'Limpieza y aspirado total', 'Pulido y corrección de pintura', 'Tratamiento cerámico completo', 'Detalle de rines y llantas', 'Detallado de cristales']
  }
];

export const UPSELLS = [
  {
    id: 'limpieza_profunda', name: 'Limpieza profunda de interiores', icon: 'interior',
    prices: { auto_chico: 700, auto_mediano: 800, auto_grande: 900, suv_chica: 1000, suv_grande: 1100, camioneta_larga: 1300, camioneta_extra: 1500 }
  },
  {
    id: 'pulido_correccion', name: 'Pulido y corrección de pintura', icon: 'polish',
    prices: { auto_chico: 1200, auto_mediano: 1400, auto_grande: 1600, suv_chica: 1800, suv_grande: 2000, camioneta_larga: 2300, camioneta_extra: 2600 }
  },
  {
    id: 'tratamiento_ceramico', name: 'Tratamiento cerámico (6-8 meses)', icon: 'ceramic',
    prices: { auto_chico: 1800, auto_mediano: 2100, auto_grande: 2400, suv_chica: 2700, suv_grande: 3000, camioneta_larga: 3500, camioneta_extra: 4000 }
  },
  {
    id: 'descontaminacion_vidrios', name: 'Descontaminación de Vidrios', icon: 'glass',
    prices: { auto_chico: 1800, auto_mediano: 2100, auto_grande: 2400, suv_chica: 2700, suv_grande: 3000, camioneta_larga: 3500, camioneta_extra: 4000 }
  },
  {
    id: 'proteccion_llantas', name: 'Protección de llantas', icon: 'tires',
    prices: { auto_chico: 350, auto_mediano: 350, auto_grande: 350, suv_chica: 350, suv_grande: 350, camioneta_larga: 350, camioneta_extra: 350 }
  },
  {
    id: 'detallado_motor', name: 'Detallado de motor', icon: 'engine',
    prices: { auto_chico: 500, auto_mediano: 500, auto_grande: 500, suv_chica: 500, suv_grande: 500, camioneta_larga: 600, camioneta_extra: 700 }
  }
];

export const CARE_PLANS = [
  {
    id: 'care_mensual',
    name: 'STREET PRIME CARE · MENSUAL',
    price: 999,
    benefits: [
      '1 servicio Street Clean al mes',
      'Aplicable a cualquier tipo de vehículo',
      'Prioridad en agenda',
      '10% de descuento en servicios adicionales'
    ],
    accent: '#25D366'
  },
  {
    id: 'care_bimestral',
    name: 'STREET PRIME CARE · BIMESTRAL',
    price: 1799,
    benefits: [
      '2 servicios Street Clean',
      'Prioridad en agenda',
      '10% de descuento en servicios adicionales'
    ],
    accent: '#1F6AE1'
  },
  {
    id: 'care_trimestral',
    name: 'STREET PRIME CARE · TRIMESTRAL',
    price: 2999,
    benefits: [
      '3 servicios Street Clean',
      'Prioridad máxima en agenda',
      '15% de descuento en servicios adicionales',
      'Protección de llantas incluida una vez'
    ],
    accent: '#FFFFFF'
  }
];

export const TESTIMONIALS = [
  { name: "Carlos Mendoza", location: "Santa Fe, CDMX", rating: 5, text: "Excelente servicio, mi auto quedó como nuevo. Muy profesionales y puntuales. Totalmente recomendados.", vehicle: "BMW Serie 3" },
  { name: "Ana García", location: "Álvaro Obregón", rating: 5, text: "Increíble la atención y el resultado. El detallado premium vale cada peso. Ya es mi servicio de confianza.", vehicle: "Honda CR-V" },
  { name: "Roberto Sánchez", location: "San Ángel", rating: 5, text: "Muy conveniente que vengan a domicilio. El interior de mi camioneta quedó impecable. Volveré a contratar.", vehicle: "Toyota Hilux" },
  { name: "María López", location: "Coyoacán", rating: 5, text: "El mejor servicio de detallado que he probado. Profesionales, amables y con resultados espectaculares.", vehicle: "Mazda CX-5" }
];

export const GALLERY_ITEMS = [
  { id: 1, title: "Detallado Interior Premium", description: "Limpieza profunda de asientos y tablero", image: "https://customer-assets.emergentagent.com/job_auto-detail/artifacts/81groi0z_Detallado%20Interior%20Premium.jpeg" },
  { id: 2, title: "Pulido de Pintura", description: "Corrección de rayones y brillo espejo", image: "https://customer-assets.emergentagent.com/job_auto-detail/artifacts/vu9rim2m_Pulido%20de%20Pintura.jpeg" },
  { id: 3, title: "Lavado Exterior Completo", description: "Eliminación de contaminantes y encerado", image: "https://customer-assets.emergentagent.com/job_auto-detail/artifacts/ae8042wn_Lavado%20Exterior%20Completo.jpeg" },
  { id: 4, title: "BMW Z4 Detallado", description: "Exterior impecable con brillo espejo", image: "https://customer-assets.emergentagent.com/job_auto-detail/artifacts/zln822g6_4.jpeg" },
  { id: 5, title: "Volvo EX30 Premium", description: "Acabado profesional completo", image: "https://customer-assets.emergentagent.com/job_auto-detail/artifacts/ej5sbo9g_6.jpeg" },
  { id: 6, title: "Interior de Lujo", description: "Asientos de piel como nuevos", image: "https://customer-assets.emergentagent.com/job_auto-detail/artifacts/03q0wc0v_interior%20de%20lujo.jpeg" }
];

// Animation variants
export const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

