---
target: landing principal (src/app/page.tsx)
total_score: 20
max_score: 36
na_heuristics: 7
p0_count: 3
p1_count: 2
timestamp: 2026-08-21T00-55-17Z
slug: src-app-page-tsx
---
Method: dual-agent (A: a124818a30f823d8b · B: abcfc285519eb672a)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Checkout muestra títulos de paso pero sin indicador de progreso (1 de 2 / 2 de 2) |
| 2 | Match System / Real World | 3 | Lenguaje y métodos de pago encajan con Perú; "Compra protegida" no matchea realidad (sin garantía/devoluciones) |
| 3 | User Control and Freedom | 2 | Botón "Atrás" en checkout funciona; nav/footer rotos quitan control de navegación |
| 4 | Consistency and Standards | 1 | Nav apunta a contenedor inexistente; footer usa IDs que no matchean los reales; componente "Testimonials" no muestra testimonios |
| 5 | Error Prevention | 3 | Campos required con validación nativa; sin validación inline en vivo |
| 6 | Recognition Rather Than Recall | 3 | Precio/producto/beneficios visibles sin memoria; total repetido en cada paso |
| 7 | Flexibility and Efficiency | n/a | Landing no necesita shortcuts de power-user |
| 8 | Aesthetic and Minimalist Design | 2 | Grids de 6-8 ítems rompen tono minimalista; tema claro abandona identidad "premium oscuro" de marca |
| 9 | Error Recovery | 2 | Error de checkout usa `alert()` nativo, no estado diseñado |
| 10 | Help and Documentation | 2 | FAQ ayuda razonablemente; links legales (términos, privacidad, políticas) todos `href="#"`, sin contenido real |
| **Total** | | **20/36** | **Acceptable (56%)** |

Heurística 7 marcada n/a (no aplica a landing). Máximo aplicable: 36 (9×4).

## Design Specificity Verdict

**Veredicto: copy específico, sistema visual genérico, identidad de marca no ejecutada.**

Copy realmente hecho a medida: rieles de pago peruanos (Yape/Plin), Shalom, S/, casos de uso por audiencia (abogados, periodistas, estudiantes) — esto no se pega en un SaaS genérico sin cambios.

Pero sistema visual es plantilla DTC-gadget estándar: cards glassmorphic, gradient-text en headings, grids GSAP stagger/flip, countdown timer, comparación "tradicional vs nosotros," grid "qué incluye la caja." Cambia iconos/copy y esta misma estructura vende botella de agua o purificador sin tocar layout. Nada en el lenguaje visual dice "grabadora de voz" salvo un render de producto.

**Falla más grande: PRODUCT.md exige fondo degradado oscuro índigo (#050510→#0a0a2e→#0f0f1a), tono premium/minimalista. `globals.css` (líneas 11-21, 47-53) define tema claro: `--background: #fafafa`, gradiente body `#fbfbfd → #f4f4f8 → #fafafa`. Confirmado en vivo: sitio renderiza claro/blanco, no oscuro-premium especificado.** El único diferenciador que la marca pidió nunca se construyó.

**Scan determinístico**: CLI detectó 2 hits (`gradient-text`, ambos en definición de clase en `globals.css` líneas 83 y 92). Overlay en navegador vivo detectó **36 hallazgos** en total:
- `gradient-text` — 4 ocurrencias renderizadas
- `low-contrast` — 4.47:1 (necesita 4.5:1) — texto blanco sobre #6366f1, botones CTA — 2 ocurrencias
- `dark-glow` — box-shadow glow zero-offset — 4 ocurrencias
- `radial-spotlight-glow` — spotlight radial en superficies grandes — 2 ocurrencias
- `undersized-ui-text` — texto funcional bajo 11px — "60% OFF" (10px), "Sin MemoAI" (10px ×4), labels countdown "Horas/Min/Seg" (10px)
- `tiny-text` — varias ocurrencias de 10px
- `ai-color-palette` — gradientes cian (×3) y púrpura/violeta (×1) señalados como paleta típica de IA
- `text-occlusion` — 8 ocurrencias, elemento cubierto 50-100% por otro (labels "TIEMPO"/"CLIENTES" tapados por heading; párrafos de problem-cards colisionando con su título)

`.gradient-text`/`.gradient-text-green` usado en 24 lugares del código (Hero, FAQ, Comparison, Footer, CheckoutModal, FinalCTA, Offer ×2, ImmersiveExperience ×5, etc.) — no es solo el logo, es tratamiento por defecto en casi cada heading/CTA del sitio. Confirma el veredicto: patrón amplio, no caso aislado.

**Overlays visuales**: inyección de overlay funcionó, corrió en tab `[Human]`, server se detuvo limpio al terminar. 36 hallazgos leídos de consola.

## Overall Impression

Checkout funciona bien y el copy conoce a su audiencia peruana. Pero la primera pantalla después del Hero muestra texto corrupto (mojibake), la navegación promete 5 destinos y ninguno funciona de verdad, y el sistema visual contradice la identidad de marca que el propio PRODUCT.md pide. La mayor oportunidad: arreglar los 3 blockers técnicos (encoding, nav, footer) — son baratos de fixear y hoy hacen que el sitio se vea roto/no confiable en el primer scroll de un visitante nuevo.

## What's Working

1. **Mecánica de checkout sólida**: flujo multi-paso (datos → pago → éxito), creación de orden en vivo, link de WhatsApp pre-llenado con detalle de orden, copiar-al-portapapeles para Yape/Plin. El plumbing funcional del modelo de pago peruano está bien hecho y refleja correctamente el mecanismo de PRODUCT.md ("cerrar venta en WhatsApp").
2. **FAQ y comparación comunican el mecanismo con claridad**: timeline de 5 pasos y tabla tradicional-vs-MemoAI hacen la propuesta de valor concreta sin jerga.
3. **Detalles de comercio Perú-específicos correctamente enhebrados**: envío Shalom gratis, precios en S/, Yape/Plin — no es boilerplate genérico.

## Priority Issues

**[P0] Texto corrupto (mojibake) en Problem, Solution y Comparison**
**Por qué importa**: primer bloque de contenido después del Hero, en el idioma exacto de la audiencia, se ve como sitio hackeado/roto — "Â¿Te pasa esto?", "RESÃºMENES", "MÃ©todo tradicional". Confirmado en vivo desktop y mobile. Aislado a `ProblemSection.tsx`, `SolutionSection.tsx`, `Comparison.tsx` (probable doble-encoding UTF-8 como Latin-1 al guardar).
**Fix**: re-guardar esos 3 archivos como UTF-8 limpio, verificar cada tilde en diff antes de mergear.
**Comando sugerido**: `/impeccable polish`

**[P0] Navegación interna completamente rota**
**Por qué importa**: `Navbar.tsx` (`scrollToScene`, líneas 41-56) busca `[data-scene-container]`, que solo existe en `ImmersiveExperience.tsx` — componente que `page.tsx` **no renderiza**. 4 de 5 links del navbar (PROBLEMA, BENEFICIOS, FUNCIONA, USOS) no hacen nada. `Footer.tsx` (líneas 22-29) genera hrefs por slug automático: 3 de 4 links "Producto" apuntan a IDs que no existen (`#beneficios`, `#cómo-funciona`, `#testimonios` vs los reales `how-it-works`, `testimonials`). Un usuario que intenta navegar rápido concluye que el sitio está roto.
**Fix**: reescribir `scrollToScene` para apuntar a IDs reales de sección, o quitar la query rota; hardcodear hrefs del footer a los IDs reales de `page.tsx`.
**Comando sugerido**: `/impeccable harden`

**[P0] Identidad visual contradice la marca especificada**
**Por qué importa**: PRODUCT.md pide fondo oscuro-premium índigo; el sitio shippeado es tema claro genérico. Combinado con 24 usos de gradient-text, glow effects (`dark-glow`, `radial-spotlight-glow`) y paletas cian/púrpura marcadas como "AI-tell" por el detector — el resultado visual es intercambiable con cualquier producto DTC genérico, exactamente lo que la marca pidió evitar.
**Fix**: decidir si el pivote a tema claro fue intencional; si no, reconstruir sobre la paleta oscura especificada y auditar los 24 usos de gradient-text.
**Comando sugerido**: `/impeccable document` (para fijar el sistema real primero), luego `/impeccable colorize` o `/impeccable typeset`

**[P1] "Compra protegida" contradice la verdad del producto**
**Por qué importa**: badge con escudo en `Offer.tsx` (línea 151, antes de pagar) y en `gracias/page.tsx` (línea 84, después de pagar) — los dos momentos de mayor riesgo de confianza en todo el funnel — sin ninguna explicación de qué cubre. PRODUCT.md confirma que **no hay garantía ni devoluciones**. FAQ además promete "soporte técnico prioritario y actualizaciones de software gratuitas" sin respaldo en el producto real.
**Fix**: reemplazar por claim específico y verdadero (ej. "Soporte por WhatsApp antes y después de tu compra," que sí es cierto), o construir política real antes de usar lenguaje de garantía.
**Comando sugerido**: `/impeccable clarify`

**[P1] Contenido de problem-cards inalcanzable en mobile**
**Por qué importa**: `ProblemSection.tsx` (líneas 135-186) muestra la explicación real solo vía flip con `group-hover:[transform:rotateY(180deg)]` — trigger de solo-hover. Confirmado en 375px: tocar la card no hace nada salvo seleccionar texto. PRODUCT.md declara mobile-first como principio explícito ("la mayoría del tráfico será desde celular"); esto esconde contenido real a la mayoría de visitantes sin fallback.
**Fix**: reemplazar hover-flip por tap-to-expand o contenido siempre visible en mobile.
**Comando sugerido**: `/impeccable adapt`

## Persona Red Flags

**Jordan (primera vez, confundido)**: llega al Hero, lee bien el headline, hace scroll — y lo siguiente que ve es "Â¿Te pasa esto?" con acentos rotos por toda la sección Problem. Un visitante frío sin contexto lee eso como "este sitio está roto/es sospechoso" — fatal para una página cuyo único trabajo es generar confianza en una marca peruana desconocida. Si después prueba el navbar para saltar a "BENEFICIOS," no pasa nada — sin error, sin scroll, puro silencio, reforzando "esto está roto."

**Riley (stress tester deliberado)**: clickea cada link de nav y footer metódicamente — encuentra que 4/5 links del navbar y 3/4 del footer no hacen nada. Hace scroll rápido (drag del scrollbar, End) y — confirmado en vivo — encuentra sección UseCases con mayoría de cards invisibles (opacity 0, animación GSAP scroll-trigger que nunca completó su estado) y FinalCTA completamente en blanco. Riley concluye que la página está sin terminar/con bugs, lo cual mina la confianza justo antes del checkout.

**Casey (mobile, distraída)**: en mobile, "COMPRAR AHORA" está ~1.4 pantallas abajo (después de logo, headline, badge, render grande de producto, chips de beneficio) — bastante scroll antes de la única acción que Casey quiere, aunque sí es alcanzable. Peor: las flip-cards de Problem son lo natural para tocar mientras hace skim en el celular, y tocar no hace nada — Casey no recibe feedback, puede pensar que la página se congeló, y es muy probable que rebote antes de llegar al CTA. Casey también es la persona más propensa a hacer scroll rápido, disparando directamente el bug de secciones en blanco/opacity-0.

## Minor Observations

- CTA secundario "VER PRODUCTO" usa fill glass casi-blanco sobre fondo casi-blanco — contraste bajo, confirmado en vivo.
- Order ID se trunca con guion al final (`orderId.slice(0, 18)` en `CheckoutModal.tsx:142` y `gracias/page.tsx:48`) → `ORD-1787273318640-`, se ve cortado en un momento de reassurance.
- Error de checkout usa `alert()` nativo (`CheckoutModal.tsx:102`), choca contra el resto de UI custom-styled.
- 4 links legales del footer (Términos, Privacidad, Política de compras, Política de envíos) todos `href="#"` — sin contenido real, relevante para un flujo de pago real.
- `TESTIMONIALS` en `constants.ts` (líneas 74-103) tiene clientes y quotes 100% inventados con métricas falsas ("Ahorra 10 horas semanales," "Productividad +200%"). Hoy no se renderiza en ningún lado (el componente `Testimonials.tsx` en realidad muestra contenido de la caja, no testimonios) — código muerto, pero landmine: alguien lo va a reconectar tal cual algún día. Mejor borrarlo ahora.
- Sin `:focus-visible` dedicado en `Button.tsx` ni items de nav — navegación por teclado depende 100% de defaults del browser.
- "COMPRAR AHORA" repetido literal 5+ veces en todo el funnel sin variación de framing por etapa.
- CTA de WhatsApp en `gracias/page.tsx:94` usa número placeholder hardcodeado (`51999999999`) en vez del número real configurado en `/admin` — el cierre de venta puede fallar en silencio en producción.
- Flash de contenido invisible en Hero mobile al cargar (~2s antes de que headline/precio/CTA aparezcan).
- Contraste 4.47:1 en botones CTA (blanco sobre #6366f1) — bajo el mínimo WCAG AA de 4.5:1.
- 8 casos de texto solapado/tapado por otro elemento (labels "TIEMPO"/"CLIENTES" tapados por heading; párrafos colisionando con títulos en problem-cards).

## Questions to Consider

- Si la marca pide identidad oscura-premium y lo shippeado es claro/genérico, ¿fue pivote deliberado o deriva sin nadie notarlo — y cuál debería shippear?
- Nav y footer prometen "salta a cualquier sección al instante" y nada funciona — ¿sería más confiable hoy sin links de nav que con cinco que fallan en silencio?
- `ImmersiveExperience.tsx` existe completo (6 escenas, GSAP pinned-scroll) pero `page.tsx` no lo renderiza — ¿layout plano actual fue simplificación deliberada, o la página "real" sigue sin conectar en el repo?
