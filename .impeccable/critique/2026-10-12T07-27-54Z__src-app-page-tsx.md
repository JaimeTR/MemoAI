---
target: landing MemoAI
total_score: 22
max_score: 32
na_heuristics: 7,10
p0_count: 1
p1_count: 2
timestamp: 2026-10-12T07-27-54Z
slug: src-app-page-tsx
---
# Critique: landing MemoAI (src/app/page.tsx)
Method: dual-agent. Score 22/32 (heuristics 7 and 10 n/a, landing page). Band: Good-low (69%).
Specificity: category-interchangeable except wordmark, headline and device render. Core promise (transcript to summary) never shown.
P0 closing section claims "Pago 100% seguro", "Compra protegida", "procesado por Culqi/Mercado Pago/Izipay" with no gateway and no warranty.
P1 hero blank ~3s (GSAP from-states) and no subtitle on mobile.
P1 no transcript/summary demo; demo mp4 hidden behind "Click en el producto".
P2 checkout a11y: no role=dialog, unnamed icon buttons, native-only validation, crowded Resumen step.
P2 repetition: 6 problem cards, 6 use cases, 6 included tiles; scroll-tied opacity reveals; 26 text nodes under 12px.
Detector: 27 browser findings (gradient-text 4, low-contrast 2 at 4.47:1 white on #6366f1, dark-glow 4, radial-spotlight 3, clipped overflow 1, undersized 10px 5, tiny 11px 6); CLI 9 in ImmersiveExperience.tsx.
