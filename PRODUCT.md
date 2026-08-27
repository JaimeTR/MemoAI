# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primario:** Profesionales y ejecutivos peruanos que asisten a reuniones constantes, pierden acuerdos y dedican horas a actas y reportes.
- **Secundarios:** Estudiantes universitarios (clases), abogados (declaraciones/audiencias), consultores, periodistas, equipos comerciales.

## Product Purpose

MemoAI es una grabadora de voz física inteligente que graba reuniones, clases y entrevistas, y con IA transcribe, resume, organiza y exporta la información. La venta no es el aparato: es **tiempo, productividad y tranquilidad**. El éxito es que el cliente deje de tomar apuntes manualmente y recupere horas por semana.

## Positioning

"Deja de tomar apuntes y concéntrate en lo que realmente importa."

Mecanismo propio: grabar → transcribir con IA → resumir → organizar automáticamente. Un competidor no puede copiar la promesa de que las notas se generan solas con precisión (95%+) y se entregan organizadas por temas, sin trabajo manual.

## Operating Context

- **Mercado:** Perú, venta online, precio promocional S/ 299 (precio anterior S/ 755).
- **Envío:** gratis a todo el Perú. Lima Metropolitana: máximo 2 días (si el destino está en zona cercada, puede ser al instante vía Idrive u otro courier local). Provincia: aprox. 3 días. Vía Shalom u otra agencia a elección. Contraentrega disponible.
- **Pagos:** Yape, Plin, WhatsApp (cerrar venta por chat con captura de pago). Link de pago con tarjeta (Culqi/Mercado Pago/Izipay) pendiente de cuenta del vendedor; campo configurable en el admin.
- **Operación:** panel admin (/admin) para pedidos, clientes y configuración de números de pago. Contraseña actual: memoai2024 (cambiar en producción).
- **Almacenamiento de datos:** en memoria (in-memory DB). En producción requiere base de datos persistente (PostgreSQL/Supabase).

## Capabilities and Constraints

- Capacidades del producto: grabar audio HD, transcribir voz a texto, resumir con IA, identificar puntos clave, organizar notas, exportar (PDF/Word/TXT), batería de larga duración, 64GB.
- Restricciones confirmadas:
  - **NO existe garantía de 1 año** (la landing la menciona y debe corregirse).
  - **NO hay devoluciones.** Se requieren políticas de compra, envío y privacidad claras para la venta online.
  - El admin y los pedidos viven en memoria; se pierden al reiniciar.
  - Pasarela de pago real aún no integrada (sin cuenta de Culqi).
- Decidido pendiente: políticas legales exactas (términos, privacidad), número real de WhatsApp/Yape/Plin del vendedor (configurables en admin).

## Brand Commitments

- Nombre: MemoAI. Logotipo: "MEMO" en negro tinta (#0a0a0a) + "AI" con gradiente índigo (#6366f1 → #818cf8) + destello (Sparkles) en la esquina del "AI". Braze reservado solo al wordmark (archivo local `public/fonts/Braze.otf`); todo el resto de texto usa Sora.
- Tono: premium, tecnológico, minimalista (referencias: Apple, Notion, Stripe, Linear) — sin ser corporativo-frío.
- Identidad visual: "The Clean Signal". Fondo web claro (Cool Paper #fafafa → Studio White #ffffff), un solo acento cromático (Signal Indigo #6366f1) hace todo el trabajo de jerarquía, verde (#10b981) reservado a confirmación/éxito. Profundidad vía glow de color y glass/blur, no sombras neutras. Ver [DESIGN.md](DESIGN.md) para el sistema completo (paleta, tipografía, componentes, named rules).

## Evidence on Hand

- Video demo real del producto: `public/video/memoai-demo.mp4`.
- **Sin testimonios reales, sin fotos de clientes, sin prensa.** Los testimonios actuales de la landing son placeholders y deben reemplazarse por clientes reales antes de publicar; nunca inventar métricas de adopción.
- Sin estudios propios que respalden estadísticas (67%, 40%, etc.); son cifras orientativas de copy, revisar antes de producción.

## Product Principles

1. Vender el resultado (tiempo, organización, tranquilidad), nunca el hardware.
2. Cada funcionalidad debe responder a un dolor real del profesional peruano.
3. Transparencia en la compra: sin garantías falsas, sin devoluciones ocultas.
4. La conversión no termina en el pago: cerrar ventas por WhatsApp es parte del flujo.
5. Mobile-first: la mayoría del tráfico será desde celular.

## Accessibility & Inclusion

- Idioma: español (Perú).
- Landing responsive desde 320px (mobile-first), legibilidad de textos sobre fondo claro.
- Modal de video y checkout accesibles por teclado básico (botones con foco visible).
