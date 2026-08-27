export const PRODUCT = {
  name: "MEMOAI",
  tagline: "Grabadora Inteligente con Inteligencia Artificial",
  originalPrice: 755,
  salePrice: 299,
  currency: "S/",
  shipping: "ENVÍO GRATIS A TODO EL PERÚ",
} as const;

import peruUbigeoData from "./peru-ubigeo.json";
import shalomAgenciasData from "./shalom-agencias.json";

// Full official ubigeo tree: departamento -> provincia -> distritos (24 departments + Lima Metropolitana + Callao).
export const PERU_UBIGEO: Record<string, Record<string, string[]>> = peruUbigeoData;

export const PERU_DEPARTMENTS = Object.keys(PERU_UBIGEO).sort((a, b) => a.localeCompare(b, "es"));

// Lima Metropolitana districts, used by the Fast Lima delivery zone.
export const LIMA_DISTRICTS = PERU_UBIGEO["Lima"]["Lima"];

export interface ShalomAgency {
  zona: string;
  direccion: string;
  telefono: string | null;
  horario: string;
  lat: number | null;
  lng: number | null;
}

// Real Shalom pickup-office directory (pulled from Shalom's own public agency-lookup API), keyed by
// departamento -> provincia -> list of agencies, using the same department/province names as PERU_UBIGEO.
export const SHALOM_AGENCIAS: Record<string, Record<string, ShalomAgency[]>> = shalomAgenciasData;

export const DELIVERY_ZONES = [
  {
    id: "nacional" as const,
    name: "Envío Nacional",
    days: "2 a 3 días hábiles",
    description: "Envío gratis vía Shalom",
    shippingCost: 0,
    fast: false,
  },
  {
    id: "lima_fast" as const,
    name: "Envío Express - Lima",
    fullName: "Envío Express - Lima Metropolitana",
    days: "1 día hábil",
    description: "Envío con iDrive o Uber",
    shippingCost: 10,
    fast: true,
  },
];

export const HERO_BENEFITS = [
  "Transcripción automática",
  "Resúmenes con IA",
  "Audio de alta calidad",
  "Exportación inteligente",
  "Batería de larga duración",
] as const;

export const PROBLEMS = [
  {
    icon: "PenLine",
    title: "Tomar apuntes durante reuniones",
    description: "Pierdes el hilo de la conversación mientras intentas anotar todo.",
  },
  {
    icon: "AlertTriangle",
    title: "Perder información importante",
    description: "Detalles clave se pierden para siempre por no poder documentarlos.",
  },
  {
    icon: "Brain",
    title: "No recordar acuerdos",
    description: "Compromisos y decisiones se olvidan al terminar la reunión.",
  },
  {
    icon: "Clock",
    title: "Clases largas y complejas",
    description: "Horas de información que no puedes procesar en tiempo real.",
  },
  {
    icon: "FileText",
    title: "Entrevistas difíciles de documentar",
    description: "No puedes escuchar activamente y tomar notas al mismo tiempo.",
  },
] as const;

export const BENEFITS = [
  { icon: "Mic", title: "Graba todo automáticamente", description: "Audio HD con cancelación de ruido" },
  { icon: "Languages", title: "Convierte voz a texto", description: "Transcripción en tiempo real con IA" },
  { icon: "FileText", title: "Resume reuniones", description: "Resúmenes ejecutivos automáticos" },
  { icon: "GraduationCap", title: "Resume clases", description: "Notas organizadas por temas" },
  { icon: "Lightbulb", title: "Identifica puntos importantes", description: "La IA detecta ideas clave" },
  { icon: "FolderOpen", title: "Organiza información", description: "Archivado inteligente automático" },
  { icon: "Download", title: "Exporta resultados", description: "PDF, Word, TXT y más formatos" },
  { icon: "Timer", title: "Ahorra horas cada semana", description: "Recupera tu tiempo más valioso" },
] as const;

export const STEPS = [
  { step: 1, title: "Presiona grabar", description: "Un solo botón para comenzar. Sin configuraciones complicadas." },
  { step: 2, title: "MemoAI registra el audio", description: "Captura audio HD con micrófono omnidireccional." },
  { step: 3, title: "La IA transcribe", description: "Convierte voz a texto con precisión superior al 95%." },
  { step: 4, title: "La IA resume", description: "Genera resúmenes inteligentes identificando temas clave." },
  { step: 5, title: "Obtienes notas organizadas", description: "Todo listo para revisar, buscar y exportar." },
] as const;

export const USE_CASES = [
  { icon: "Briefcase", title: "Profesionales", description: "Reuniones, presentaciones y conferencias" },
  { icon: "Scale", title: "Abogados", description: "Declaraciones, audiencias y consultas" },
  { icon: "GraduationCap", title: "Estudiantes", description: "Clases, seminarios y grupos de estudio" },
  { icon: "Users", title: "Consultores", description: "Entrevistas, workshops y asesorías" },
  { icon: "Newspaper", title: "Periodistas", description: "Entrevistas, ruedas de prensa y reportajes" },
  { icon: "TrendingUp", title: "Equipos comerciales", description: "Llamadas, negociaciones y cierres" },
] as const;

export const FAQS = [
  {
    question: "¿Cómo funciona?",
    answer: "MemoAI graba audio con su micrófono omnidireccional de alta calidad. Luego, la inteligencia artificial transcribe automáticamente todo lo grabado y genera resúmenes inteligentes organizados por temas.",
  },
  {
    question: "¿Necesita internet?",
    answer: "La grabación funciona sin internet. La transcripción y generación de resúmenes requieren conexión para procesar el audio con nuestros servidores de IA. Puedes grabar offline y sincronizar después.",
  },
  {
    question: "¿La transcripción es automática?",
    answer: "Sí, la transcripción es completamente automática. MemoAI utiliza modelos de IA avanzados con una precisión superior al 95% en español e inglés.",
  },
  {
    question: "¿Cuánto dura la batería?",
    answer: "La batería de MemoAI dura hasta 20 horas de grabación continua, suficiente para jornadas completas de reuniones o clases sin necesidad de recargar.",
  },
  {
    question: "¿Cómo se exportan los archivos?",
    answer: "Puedes exportar en múltiples formatos: PDF, Word, TXT, Markdown y más. También se integra con Google Drive, Notion y otras herramientas de productividad.",
  },
  {
    question: "¿Qué pasa si mi pedido llega dañado?",
    answer: "Si tu pedido llega con daños durante el envío, contáctanos por WhatsApp dentro de las 24 horas posteriores a la entrega con fotos del producto y evaluaremos la solución caso por caso.",
  },
  {
    question: "¿Puedo devolver mi MemoAI si cambio de opinión?",
    answer: "No aceptamos devoluciones por cambio de opinión — revisa bien las especificaciones antes de comprar. Sí cubrimos defectos de fábrica o daños de transporte reportados dentro de las 48 horas de recibido. Ver política de compras completa.",
  },
] as const;
