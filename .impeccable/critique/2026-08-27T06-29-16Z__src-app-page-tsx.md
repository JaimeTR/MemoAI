---
target: Landing MemoAI (/)
total_score: 22
max_score: 36
na_heuristics: 7
p0_count: 1
p1_count: 2
timestamp: 2026-08-27T06-29-16Z
slug: src-app-page-tsx
---
# MemoAI Landing Page (`src/app/page.tsx`) — Critique

Method: dual-agent (A: design-review subagent · B: detector+browser subagent)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2/4 | Offer CTA gives zero feedback on click |
| 2 | Match System/Real World | 4/4 | S/, Yape/Plin/Shalom, Peruvian copy — strong |
| 3 | User Control and Freedom | 3/4 | No major traps |
| 4 | Consistency and Standards | 2/4 | Two CTA-wiring patterns on one page; color system contradicts DESIGN.md |
| 5 | Error Prevention | 2/4 | Primary CTA broken undetected |
| 6 | Recognition Rather Than Recall | 3/4 | Price repeated in Hero/Offer/FinalCTA |
| 7 | Flexibility/Efficiency | n/a | Persuade-mode landing page |
| 8 | Aesthetic/Minimalist | 2/4 | 3 unauthorized accent colors (red/purple/emerald) over indigo/green |
| 9 | Error Recovery | 2/4 | Broken CTA gives no error state |
| 10 | Help/Documentation | 2/4 | FAQ omits no-returns policy; 4 Footer legal links dead (`href="#"`) |

**Total: 22/36** (heuristic 7 n/a) — Acceptable band (61%).

## Design Specificity Verdict

**LLM:** Not a generic template — commerce/logistics layer (real Shalom agencies, Peru ubigeo tree, Yape/Plin/WhatsApp, copy tuned to Peruvian professional pain points) is genuinely bespoke. Marketing chrome (Problem grid, zigzag Solution, Comparison columns) follows generic SaaS-landing conventions, and the color system has drifted far enough from DESIGN.md that sections read as authored by different people.

**Deterministic scan:** CLI static scan: 0 findings. Live browser overlay: 27-35 anti-pattern hits — `gradient-text` x3 (DESIGN.md already flags ~24 occurrences), `dark-glow` x4, `ai-color-palette` (generic cyan/purple "AI product" gradients) x3, `kicker-above-heading` on 7 sections, `undersized-ui-text` x6 (<11px), `tiny-text` x5 (11px body), `skipped-heading` (h2→h4, no h3).

## Priority Issues

**[P0] Dead primary CTA in Offer.tsx** — `src/components/sections/Offer.tsx:143`: `document.getElementById("checkout-trigger")?.click()`. No element with that id exists anywhere in the repo (grep-confirmed). Sits beside price/discount/countdown — highest-intent click on the page — does nothing. Fix: wire with the same `onBuyClick` pattern as Hero/Navbar. Command: harden.

**[P1] FinalCTA doesn't open checkout either** — `FinalCTA.tsx:39` scrolls to `#offer` instead of opening the modal. Last conversion chance routes back to the broken P0 button. Command: harden.

**[P1] Color system contradicts DESIGN.md** — DESIGN.md: single indigo accent, green reserved for confirmation only. Shipped: red as full secondary palette (Problem, Comparison), emerald as primary decorative color throughout SolutionSection (not confirmation), purple driving UseCases, payment-brand badges (Yape/Plin/WhatsApp) shown directly on Offer outside the checkout context DESIGN.md restricts them to. Command: colorize.

**[P2] Undocumented third typeface** — `layout.tsx` loads Space Grotesk as `--font-heading`, used on every h1/h2. DESIGN.md specifies Sora for display, Braze exclusive to logo; Space Grotesk unmentioned. Command: audit.

**[P2] "Testimonials" section has no testimonials** — `TESTIMONIALS` array in `constants.ts` (fabricated metrics) is never imported; `Testimonials.tsx`/`id="testimonials"` renders box-contents instead. No social proof anywhere for a S/299 no-returns purchase. Command: distill.

**[P3] Countdown always resets to 23:59:59; 4 dead Footer legal links** — no persistence on the urgency timer; Términos/Privacidad/Compras/Envíos all `href="#"`. Command: harden.

## Persona Red Flags

**Jordan (first-timer):** SolutionSection re-shows the same 6 problems ProblemSection already showed. Reaches "Qué incluye" expecting social proof, finds inventory list. Taps Offer's CTA — nothing happens, no feedback.

**Riley (stress tester):** Refresh resets countdown — reads urgency as fake. Offer CTA dead, FinalCTA CTA also dead (loops back). All 4 legal links go nowhere — exactly the info Riley would seek before a Yape payment on a no-returns product.

**Casey (mobile):** Hero subtitle explaining the value prop is `hidden md:block` — hidden from the majority-mobile audience PRODUCT.md describes. Dead Offer CTA reads as "site is broken" with no devtools to diagnose.

## Minor Observations

- `Problem.tsx`, `Solution.tsx`, `Benefits.tsx` in `sections/` are confirmed dead code (not imported by `page.tsx`).
- `gradient-text` used in nearly every section headline — DESIGN.md's own Don't list already flags ~24 occurrences.
- `Logo` (Braze, logo-exclusive per DESIGN.md) reused as a decorative `<h2>` element in `SolutionSection.tsx`.
- No "garantía de 1 año" language found in current source — that PRODUCT.md-flagged issue is already resolved.

## Questions to Consider

1. If the Offer CTA has been dead undetected, how many real visitors reached the price, tried to buy, and left unnoticed?
2. DESIGN.md already reconciled one deviation from PRODUCT.md (light vs. dark theme) as a documented call — should the red/purple/green sprawl and Space Grotesk get the same reconciliation, or be pulled back to the system as written?
