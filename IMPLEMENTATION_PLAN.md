# IMPLEMENTATION_PLAN.md — Whole-site redesign/refinement pass

Design read: enterprise-infrastructure marketing for PSP buyers. Brand identity fixed (tokens, fonts, violet→cyan/lime, code-panel motif). Problem: one template repeated — cloned section families, label sprawl, per-page CSS duplication. Fix: consolidate foundation, give each page a distinct layout identity, adopt allowed prototype motifs (status-line footer, mono glyph chips, grid texture, POC dashed callout, verb chips), fix flagged copy. Honesty constraints unchanged (no fabricated stats/logos; SOC 2 = roadmap; inline claims only).

Dials: VARIANCE 6→7 · MOTION 5 (no new JS deps, no scroll-hijack) · DENSITY 4.

Gate per stage: `npm run check` + `npm run conform` + `npm run build` green + screenshots (desktop 1440 / mobile 390).

## Stage 1: Foundation
**Goal**: hoist shared patterns so redesign touches one place.
- Hoist `.section-head`, `.two-col`, pill styles → `global.css`
- `FinalCta.astro` component (props: lead?, trustLine?) replacing 4 copies
- `Eyebrow.astro` + `variant="pill"`; `.chip` mono-tag utility; absorb `.poc-eyebrow`/`.next-label`/`.code`
- `CodeTabs` `status` prop (`→ 200 OK · scheme: "mastercard" · confidence: 0.98`)
- New utilities: `.grid-texture`, `.glyph`
- `site.ts`: CTA labels locked to constants
**Success**: build/check/conform green (31 checks, 0 errors); pages untouched, no visual regression. Note: CodeTabs needed no `status` prop — the existing `footer` string prop carries the full status line.
**Status**: Complete

## Stage 2: Home (12 sections → 10)
**Goal**: merge duplicates, differentiate layouts.
1. Hero: H1 → "The BIN intelligence engine that runs in your cloud." (grad on "in your cloud"); keep DemoPanel
2. Pillars 2×2 → 2 large cards (Deploy w/ mini terminal; Correctness w/ perf stats); BvB pillar → §6; compliance pillar → §9
3. Deployment models: keep 3-col cards (owns this layout)
4. Connectors: keep split + dashed POC callout at foot
5. Try it live: `.grid-texture` band; fold "What you get" field chips below playground
6. Build vs buy: keep 2-col, absorb "live this week" energy
7. PSP + use cases merge → one `#psp` split section (copy left, six `↳` rows right)
8. How it works: CodeTabs + status line
9. Compliance strip gets headline "Your data never leaves."
10. FinalCta
**Eyebrow budget**: ≤4. **Status**: Complete (10 sections; 3 eyebrows + hero pill; screenshots verified desktop+mobile. Gotcha logged: page-scoped styles can't reach a child component's root — card label spacing lives on the h3.)

## Stage 3: Product ("engine spec sheet")
- Hero: left-aligned, oversized mono request-line motif (differentiate from Home)
- Anatomy: keep + status line
- Capabilities: cloned 2×2 → spec-sheet (4 display tiles: sub-10ms p99 / 99.9% / 8-digit / EU residency + grouped chunks, no hairline table)
- Endpoints: keep cards; GET-cyan/POST-lime verb chips + glyph chips
- Fits your stack: cloned 6-card grid → payment-flow stepper (Authorize → Route → Price → Present; vertical on mobile)
**Status**: Complete (left hero + request-line bar with blinking caret + status; spec tiles = approved inline claims only; 5-step lifecycle stepper; anatomy got the full status footer)

## Stage 4: Features ("feature atlas" identity)
- Header: add CTAs; mono `// features` identity
- Capability atlas bento: exactly 5 cells (2+3), glyph chips, 2 cells w/ mini code, tinted variation (Lookup / Batch / DCC / Flags & regulation / Confidence & provenance)
- Deployment options: add headline; cards → 3 horizontal rows
- Comparison table: retitle "Compare deployment options"; drop 3 self-referential rows → real capabilities; SOC 2 "Roadmap" phrasing everywhere
- POC callout + volume callout kept; FAQ → "Deployment questions"; Close → FinalCta
- H1: "One engine, every capability."
**Status**: Complete (glyph bento: 1 wide dark code cell + 4 cells; dark deployment rows; SOC 2 = Roadmap ×3; FAQ retitled "Deployment questions"; header gained CTAs)

## Stage 5: Company / Contact / chrome / sweep
- Company: careers CTA → mailto:careers@findthisbin.com; final CTA gets lead via FinalCta
- Contact: remove cosmetic `ref: ftb_XXXXXX` chip; success pane gains secondary CTA → /product/
- Footer: add Company (About, Careers) + Contact links
- Legal ×4: optional LegalLayout dedupe (visual parity)
- Copy sweep: CTA labels → site.ts constants; "plans/pricing" → deployment language; copy self-audit
- Docs sync: DESIGN.md page specs, CLAUDE.md (footer, Features identity, new components), README if needed
**Status**: Not Started

## Final: audits + verification
- Eyebrow budget per page, CTA contrast/wrap/duplicate-intent, form contrast, reduced-motion, keyboard focus, theme lock
- Honesty re-audit (no fabricated stats/logos snuck in)
- Screenshots every page ×2 widths; check+conform+build green
- Remove this file
**Status**: Not Started

## Embedded decisions (approved with plan)
1. Home H1 → option A ("…that runs in your cloud.")
2. Careers CTA → mailto:careers@findthisbin.com
3. Contact ref chip → remove
4. PSP + use-cases merge → proceed (fallback: 11 sections if it reads badly)
