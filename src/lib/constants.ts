export const PRODUCT = {
  name: "MEMOAI",
  tagline: "Grabadora Inteligente con Inteligencia Artificial",
  originalPrice: 755,
  salePrice: 299,
  currency: "S/",
  shipping: "ENVÍO GRATIS A TODO EL PERÚ",
} as const;

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

export const TESTIMONIALS = [
  {
    name: "María García",
    role: "Abogada Corporativa",
    text: "MemoAI transformó mi forma de trabajar. Ya no pierdo detalles en las reuniones con clientes. Las transcripciones son increíblemente precisas.",
    result: "Ahorra 10 horas semanales",
    avatar: "MG",
  },
  {
    name: "Carlos Mendoza",
    role: "Estudiante de Medicina",
    text: "Mis apuntes ahora son perfectos. La IA resume las clases de 2 horas en puntos clave que puedo estudiar fácilmente.",
    result: "Notas 90% más completas",
    avatar: "CM",
  },
  {
    name: "Ana Rodríguez",
    role: "Consultora de Negocios",
    text: "Después de cada reunión con clientes, MemoAI me entrega un resumen ejecutivo perfecto. Mis clientes quedan impresionados.",
    result: "Productividad +200%",
    avatar: "AR",
  },
  {
    name: "Diego Torres",
    role: "Periodista Freelance",
    text: "Las entrevistas ahora se transcriben solas. Puedo enfocarme en hacer mejores preguntas sin preocuparme por tomar notas.",
    result: "3x más entrevistas publicadas",
    avatar: "DT",
  },
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
    question: "¿Tiene garantía?",
    answer: "Sí, MemoAI incluye 1 año de garantía contra defectos de fabricación. Además, ofrecemos soporte técnico prioritario y actualizaciones de software gratuitas.",
  },
] as const;
