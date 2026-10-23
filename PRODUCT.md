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
- **Tienda:** desde el 23 oct 2026 `devmarkpe.store` es la tienda completa DevmarkPE Store (inicio con catálogo e identidad de DEVMARK) y esta landing vive en `/producto/memoai`. El catálogo (precio, stock, fotos) se gestiona en el ERP Devmark; ver README. No hay cuenta de pasarela de tarjeta y no se planea mostrar tarjeta por ahora.
- **Pagos mostrados al cliente:** pago manual por Yape o Plin (captura de pago por WhatsApp) y contraentrega (confirmado como vigente por ahora). Sin pasarela: no mostrar Visa, Mastercard, Culqi, Mercado Pago ni Izipay (la opción de tarjeta del checkout depende de `paymentLinkEnabled` en ajustes, desactivada por defecto).
- **Confirmación de pedido:** correo automático por SMTP al crear el pedido, con las mismas variables `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` y `SMTP_FROM` que usa el ERP pero con un buzón propio de la tienda (por ejemplo `store@devmarkpe.com` o `soporte@devmarkpe.store`), más `SITE_URL`; apagado si faltan. WhatsApp por enlace `wa.me` con el número de pedido, sin API de Meta: el cliente lo abre desde el paso de éxito, la página de gracias o el propio correo.
- **Operación:** todo se gestiona desde el ERP Devmark (panel único): productos, precios, stock y fotos (Tienda → Productos de tienda), cupones (Cupones de tienda), datos de pago y contacto (Ajustes de tienda) y el estado de cada pedido (Pedidos de tienda). La tienda no tiene panel propio desde el 23 oct 2026. Cada pedido nace en la tienda y se empuja al ERP; los cambios de estado se hacen en el ERP, que avisa a la tienda (`POST /api/erp/pedidos`, firmado) y la tienda escribe al cliente. Variables: `ERP_API_URL`, `ERP_TIENDA_SECRET` (igual a `TIENDA_SIGNING_SECRET` del ERP) y `ERP_EMPRESA_ID`. Cada comprador tiene cuenta propia (magic link) para seguir sus pedidos.
- **Almacenamiento de datos:** Supabase (esquema en `supabase/schema.sql`): pedidos, clientes, productos, cupones y ajustes. Cuentas de cliente con magic link.

## Capabilities and Constraints

- Capacidades del producto: grabar audio HD, transcribir voz a texto, resumir con IA, identificar puntos clave, organizar notas, exportar (PDF/Word/TXT), batería de larga duración, 64GB.
- Restricciones confirmadas:
  - **NO existe garantía de 1 año** (la landing la menciona y debe corregirse).
  - **NO hay devoluciones.** Se requieren políticas de compra, envío y privacidad claras para la venta online.
  - Sin pasarela de tarjeta: el cobro es manual por Yape o Plin.
  - **No hay devoluciones** (confirmado por el vendedor). La política ante producto defectuoso o dañado en el envío está por definir: el FAQ dice 24 horas, la política de compras y los términos dicen 48 horas, y el vendedor indicó que no hay devolución. Antes de publicar, unificar el texto y validarlo legalmente (el Código de Protección al Consumidor de Perú suele exigir remedios ante defectos).
  - Integración con el ERP Devmark: sin definir (enlace y modelo de datos pendientes).
- Decidido pendiente: políticas legales exactas (términos, privacidad), número real de WhatsApp/Yape/Plin del vendedor (configurables en admin).

## Brand Commitments

- Nombre: MemoAI. Logotipo: "MEMO" en negro tinta (#0a0a0a) + "AI" con gradiente índigo (#6366f1 → #818cf8) + destello (Sparkles) en la esquina del "AI". Braze reservado solo al wordmark (archivo local `public/fonts/Braze.otf`); todo el resto de texto usa Sora.
- Tono: premium, tecnológico, minimalista (referencias: Apple, Notion, Stripe, Linear) — sin ser corporativo-frío.
- Identidad visual: "The Clean Signal". Fondo web claro (Cool Paper #fafafa → Studio White #ffffff), un solo acento cromático (Signal Indigo #6366f1) hace todo el trabajo de jerarquía, verde (#10b981) reservado a confirmación/éxito. Profundidad vía glow de color y glass/blur, no sombras neutras. Ver [DESIGN.md](DESIGN.md) para el sistema completo (paleta, tipografía, componentes, named rules).

## Evidence on Hand

- Video demo real del producto: `public/video/memoai-demo.mp4`. El vendedor también cuenta con fotos o video adicionales del producto (rutas por confirmar).
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
