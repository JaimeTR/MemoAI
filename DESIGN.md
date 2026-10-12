---
name: MemoAI
description: Grabadora de voz inteligente con IA — landing de venta directa para Perú
colors:
  primary: "#6366f1"
  primary-light: "#818cf8"
  secondary: "#10b981"
  neutral-bg: "#fafafa"
  neutral-surface: "#ffffff"
  neutral-surface-alt: "#f2f2f5"
  neutral-ink: "#0a0a0a"
  neutral-muted: "#5f6672"
  neutral-border: "rgba(10, 10, 10, 0.08)"
typography:
  display:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 5vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Sora, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Braze, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.02em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  full: "9999px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.primary-light}"
  button-secondary:
    backgroundColor: "rgba(255, 255, 255, 0.75)"
    textColor: "{colors.neutral-ink}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  button-ghost:
    textColor: "{colors.neutral-muted}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  card-default:
    backgroundColor: "{colors.neutral-surface}"
    rounded: "{rounded.lg}"
    padding: "24px"
  badge-accent:
    backgroundColor: "rgba(99, 102, 241, 0.2)"
    textColor: "{colors.primary-light}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
  badge-success:
    backgroundColor: "rgba(16, 185, 129, 0.2)"
    textColor: "{colors.secondary}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
---

# Design System: MemoAI

## Overview

**Creative North Star: "The Clean Signal"**

MemoAI vende un objeto físico cuyo trabajo es capturar audio con precisión y devolver orden de ese ruido. El sistema visual sigue esa misma lógica: superficies claras y silenciosas (`#fafafa` a `#ffffff`) que dejan que un solo acento — el índigo de la marca — sea la señal que corta el ruido. No hay una segunda paleta compitiendo por atención; hay una superficie neutra y un pulso de color que marca lo que importa.

Recomendación de esta pasada de `document`: el código shippeado hoy es **tema claro**, no el "fondo degradado oscuro índigo" que `PRODUCT.md` describe en Brand Commitments. Ese conflicto ya salió en `/impeccable critique` (P0). Dado que el objetivo es vender — y que un tema claro/glass con glow de acento suele leer mejor en pantallas de gama media bajo luz de día, que es donde vive el tráfico mobile peruano — esta pasada documenta el sistema **tal como está construido** y recomienda actualizar `PRODUCT.md` para que la identidad oficial sea esta, en vez de revertir el código a oscuro. Es una recomendación, no una decisión tomada por este archivo; la marca final la confirma el usuario en `PRODUCT.md`.

El sistema es premium sin ser corporativo-frío: usa glass (blur) y glow de color en vez de sombras neutras duras, lo que le da una sensación más suave y táctil que un dashboard SaaS típico, sin perder la seriedad que un comprador de un aparato de S/299 necesita sentir antes de pagar.

**Key Characteristics:**
- Un solo acento cromático (índigo) hace todo el trabajo de jerarquía; el resto es neutro.
- Profundidad vía glow de color y glass/blur, no drop-shadows neutras.
- Braze (fuente de marca) reservada exclusivamente al wordmark del logo; todo el resto de texto usa Sora.
- Radios generosos y consistentes: todo pastilla (`full`) o esquina redondeada suave, nunca esquina recta.

## Colors

Paleta de dos acentos sobre base neutra: índigo para la acción/marca, verde para confirmación/pago-exitoso. Todo lo demás es escala de grises cálidos.

### Primary
- **Signal Indigo** (`#6366f1`): acento único de marca. CTA primario, focus rings, glow de fondo, texto de énfasis (`gradient-text`), wordmark "AI" del logo.
- **Signal Indigo Soft** (`#818cf8`): estado hover del acento primario; también el extremo claro del gradiente del logo.

### Secondary
- **Confirm Green** (`#10b981`, familia emerald): confirmación y éxito — badge "Envío gratis", check de beneficios, pantalla de compra exitosa, selector de Yape/Plin activo. Nunca compite con el índigo por atención primaria; aparece solo en momentos de confirmación/reassurance.

### Neutral
- **Studio White** (`#ffffff`): superficie de cards e inputs.
- **Cool Paper** (`#fafafa`, con gradiente sutil `#fbfbfd → #f4f4f8 → #fafafa` en el body): fondo base de toda la página.
- **Mist Grey** (`#f2f2f5`): superficie secundaria, fondo de inputs y bloques de resumen.
- **Ink Black** (`#0a0a0a`): texto principal.
- **Slate Muted** (`#5f6672`): texto secundario, labels, precios tachados.
- **Hairline** (`rgba(10, 10, 10, 0.08)`): todos los bordes de cards, inputs, nav.

### Named Rules
**The One Signal Rule.** El índigo es el único color que compite por atención de marca en cualquier pantalla. El verde solo aparece para confirmar, nunca para llamar la atención hacia una decisión pendiente.

**The Third-Party Color Exception.** Los íconos de método de pago (WhatsApp `#25D366`, Yape `#7B2CBF`, Plin `#00A6FF`) usan sus colores de marca oficiales — viven solo dentro del selector de método de pago del checkout, nunca fuera de ese contexto, y no cuentan como parte de la paleta del sistema.

## Typography

**Display Font:** Space Grotesk (con fallback `system-ui, sans-serif`) — todo `h1`/`h2` vía la clase `font-heading`.
**Body Font:** Sora (con fallback `system-ui, sans-serif`)
**Label / Brand Font:** Braze (con fallback `sans-serif`) — exclusivo del wordmark

**Character:** Space Grotesk es geométrica y de trazo firme, con terminales ligeramente cuadrados que le dan más carácter técnico que Sora en tamaño grande — por eso lleva todos los headlines. Sora sigue haciendo el trabajo de body/label: más neutra y legible a tamaños chicos. Braze es más expresiva y solo aparece una vez por pantalla: el logo.

Nota de reconciliación (`document`, agosto 2026): el código shippeado usa Space Grotesk para todo headline (`--font-heading` en `globals.css`, cargada en `layout.tsx`) de forma consistente en las ~24 pantallas del sitio — no es una desviación puntual, es una decisión ya vigente en todo el producto. Este archivo documenta esa realidad en vez de mandar un swap masivo a Sora sin brief que lo pida.

### Hierarchy
- **Display** (700, Space Grotesk, `text-2xl` a `text-5xl` responsivo / 24px→48px, line-height ajustado): headline del Hero, títulos de sección.
- **Body** (400, Sora, `text-base` a `text-xl` / 16px→20px, line-height relajado): párrafos, subtítulos.
- **Label** (500-700, Sora, `text-xs` a `text-sm` / 12px-14px): badges, chips de beneficio, labels de checkout.
- **Brand mark** (700, Braze, `text-lg` a `text-5xl` según contexto): exclusivo del wordmark "MEMO" + "AI".

### Named Rules
**The Logo-Only Rule.** Braze se usa únicamente en `Logo.tsx` y en un micro-label de marca (`FloatingProduct.tsx`). Ningún headline de sección, botón, o body copy usa Braze — eso mantiene la fuente de marca rara y reconocible en vez de diluida.

## Layout

Contenedor centrado `max-w-5xl` (secciones de contenido) a `max-w-3xl`/`max-w-lg` (modales, texto largo). Padding horizontal base `px-4`, mobile-first: los tamaños de texto y espaciado escalan hacia arriba en `md:`/`lg:`, nunca al revés. Ritmo vertical de sección generoso (`py-16` a `py-24` típico), con `mb-4` a `mb-8` entre bloques dentro de una sección. Grids de tarjetas usan 2 columnas en mobile, 3-4 en desktop.

## Elevation & Depth

El sistema no usa sombras neutras clásicas. La profundidad se transmite con **glow de color** (box-shadow con el índigo de marca, sin offset) y **glass** (fondo translúcido + blur de 20px). El rol del glow es **estructural**: el CTA primario siempre lleva el glow más fuerte de la pantalla — es señal de jerarquía, no decoración ambiental. Cuanto más glow, más importante es el elemento.

### Shadow Vocabulary
- **CTA glow** (`box-shadow: 0 0 30px rgba(99,102,241,0.3)`, hover `0 0 50px rgba(99,102,241,0.5)`): exclusivo del botón primario — señala "esta es la acción".
- **Ambient pulse** (`animate-pulse-glow`, `0 0 20px var(--accent-glow), 0 0 60px rgba(99,102,241,0.1)` pulsando a `0 0 40px / 0 0 80px`): reservado para el botón "COMPRAR" del nav flotante — refuerza la única acción que debe notarse mientras el usuario navega.
- **Modal shadow** (`shadow-2xl`, Tailwind default): la única sombra neutra del sistema, exclusiva de superficies flotantes tipo modal/nav — ahí sí se necesita separación del fondo sin implicar "esto es la acción principal".

### Named Rules
**The Glow Hierarchy Rule.** Solo el CTA primario en pantalla lleva glow de color a la vez. Si dos elementos brillan igual, ninguno gana — por eso el glow nunca se aplica a más de un botón visible por sección.

## Shapes

Radio generoso, sin esquinas rectas en ningún componente interactivo. Escala real en el código (por frecuencia): `xl` 12px (52 usos, inputs y bloques), `full` (49, botones y pills), `2xl` 16px (33, cards), `lg` 8px (30), `3xl` 24px (9, modales). Hay además dos valores sueltos (`rounded-[1.5rem]`, `rounded-[1.75rem]`) que deberían ser `3xl`. Antes se documentaba `sm`/`md`/`lg`/`xl` con otros píxeles; esta lista refleja el código. Pills y badges usan `full` (botones, pills, badges, avatares de ícono). Sin bordes duros — donde hay borde, es `Hairline` de 1px casi invisible, nunca un borde de color sólido salvo en estados de selección (checkout).

## Components

### Buttons
- **Shape:** siempre pill (`rounded-full`).
- **Primary:** fondo Signal Indigo, texto blanco, glow CTA (ver Elevation), `hover:` fondo Signal Indigo Soft + glow más fuerte, `whileTap` escala 0.98.
- **Secondary:** glass (blanco 75% + blur 20px), texto Ink Black — pensado para "acción secundaria sin competir con el CTA".
- **Ghost:** sin fondo, texto Slate Muted, hover a Ink Black.

### Cards / Containers
- **Corner Style:** 16px (`rounded-2xl`).
- **Background:** tres variantes — `default` (Studio White + borde Hairline), `glass` (blanco translúcido + blur), `glow` (borde-gradiente índigo sobre superficie sólida).
- **Shadow Strategy:** ninguna sombra propia; la variante `glow` usa el vocabulario de Elevation, no una sombra nueva.
- **Internal Padding:** 24px.

### Inputs / Fields (checkout)
- **Style:** fondo Mist Grey translúcido (60%), borde Hairline, radio 12px.
- **Focus:** borde pasa a Signal Indigo al 50% + ring de 1px al 30% — sin cambio de fondo, solo borde/ring.
- **Selección (radio de método de pago):** el label completo cambia de borde y fondo (verde para Yape/Plin/WhatsApp, índigo para el link de tarjeta) — el estado seleccionado se ve en toda la tarjeta, no solo en el radio.

### Navigation
- **Estilo:** pill flotante centrada, glass (blanco 80% + blur 20px), está presente desde el inicio a ancho de hero (máx. 1152px) y, tras 40px de scroll, se compacta a píldora flotante (máx. 768px, `top: 12px`).
- **Estados:** links en Slate Muted → Ink Black al hover; el ítem "COMPRAR" siempre lleva fondo Signal Indigo + `animate-pulse-glow`, distinto de los demás links.
- **Mobile:** menú fullscreen glass (blanco 97% + blur 30px), mismos estilos de link a tamaño `text-xl`.

### Logo (signature component)
Wordmark en dos partes: "MEMO" en Ink Black + "AI" con `gradient-text` (índigo a índigo-claro, animado) y un ícono de destello (`Sparkles`) superpuesto en la esquina superior derecha de "AI". Es el único lugar del sistema donde texto usa gradiente animado y la única aparición de Braze.

## Do's and Don'ts

### Do:
- **Do** usar el glow índigo solo en el elemento de mayor prioridad de la pantalla (The Glow Hierarchy Rule).
- **Do** mantener Braze exclusivo al wordmark del logo (The Logo-Only Rule).
- **Do** usar verde (`Confirm Green`) únicamente para confirmación/éxito, nunca como color de acción o decorativo.
- **Do** mantener todo radio en la escala pill/16px/24px — ninguna esquina recta en botones, cards, inputs o modales.

### Don't:
- **Don't** agregar una segunda sombra neutra fuera de `shadow-2xl` (reservada a modal/nav) — todo lo demás usa glow de color.
- **Don't** usar `gradient-text` fuera del logo sin verificar que realmente sea el punto de máxima jerarquía de esa pantalla — hoy se usa en 12 lugares del código y diluye la regla original de "el gradiente es del logo".
- **Don't** introducir un tercer acento cromático fuera de índigo/verde para uso general de UI.
- **Don't** mezclar colores de marca de terceros (WhatsApp/Yape/Plin) fuera del selector de método de pago.

## Deuda de diseño conocida

Inconsistencias entre este documento y el código, a corregir (revisión de octubre 2026):

- **Texto minúsculo:** 61 tamaños arbitrarios (`text-[11px]` 49 veces, más `10px`, `9px` y `8px`). Piso recomendado: `text-xs` (12px); solo logos o decoración pueden bajar de eso.
- **Gradientes de fondo:** 27 usos (`bg-gradient`, `radial-gradient`, `linear-gradient`: glows del hero, línea de progreso, tarjetas). El sistema los acepta como parte del glow índigo, pero conviene limitarlos a ese rol.
- **Radios sueltos:** `rounded-[1.5rem]` y `rounded-[1.75rem]` → usar `rounded-3xl`.
- **Tres fuentes** (Sora, Space Grotesk, Braze): decisión vigente; Braze solo en el logo.
- **Cobertura:** este archivo no documenta la sección "Tu compra", el selector de entrega nacional o Lima ni el mapa de dirección del checkout.
- **Seguridad del admin y pedidos (resuelto):** la contraseña ya no vive en el cliente y las rutas `/api` de gestión exigen la sesión de admin (`src/lib/admin-auth.ts`). La vista pública de un pedido (`GET /api/orders/[id]`) omite teléfono, DNI y dirección; crear pedido, validar cupón, subir comprobante e iniciar sesión de admin tienen límite de peticiones en memoria (`src/lib/rate-limit.ts`, un solo proceso Node). Los comprobantes aceptan solo imagen o PDF de hasta 5 MB.
