# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Marketing site for **FindThisBIN** (findthisbin.com) — a developer-first BIN (Bank Identification Number) intelligence API for payment platforms (PSPs). Three pages — Home (`/`), Pricing (`/pricing`), Docs (`/docs`) — sharing one nav, footer, and visual system, built as a **near-zero-JS static site** on **Astro 6** and deployed to **Cloudflare Workers (Static Assets)**.

The site is built. The stack and conventions mirror the sibling project at `../pathproof-marketing`.

Source material:
- `DESIGN.md` — the **authoritative design spec**: design tokens, per-section page specs, copy, interaction logic, and the BIN-playground sample data + deterministic synthesis rules. The source of truth when changing copy/layout/values.
- `README.md` — project overview + quick start.
- `design_files/*.dc.html` — the original HTML design **references** (prototypes), not production code. `design_files/support.js` is a throwaway runtime (see below), gitignored.
- `design_files/logo_design_files/` — brand assets (`favicon.svg`, `app-icon.svg`, `icon-{color,mono-black,mono-white}.svg`, `FindThisBIN-brand-board.html`).

## Tech stack

- **Astro 6**, `output: "static"` (all pages prerender) + **`@astrojs/cloudflare`** adapter (`imageService: "passthrough"`, `prerenderEnvironment: "node"`).
- **Tailwind CSS v4** via `@tailwindcss/vite` (no `tailwind.config.*` — config lives in CSS).
- **`@astrojs/sitemap`**; `site` set to the canonical host.
- **Self-hosted fonts via the Astro Fonts API** (`fontProviders.google()` in `astro.config.mjs`) — *not* `<link>` to Google Fonts (DESIGN.md's `<link>` instruction predates this stack; self-host instead). Families: **Space Grotesk** (display, 500/600/700), **Inter** (body/UI, 400/500/600/700), **JetBrains Mono** (code/eyebrows, 400/500/700), each exposed as a `--ff-*` CSS variable.
- **TypeScript** strict (`extends: "astro/tsconfigs/strict"`).
- **Wrangler** for deploy; **Terraform** (`infra/`, Cloudflare provider `~> 5`) for edge config only.

## Commands

| Command | Does |
|---|---|
| `npm run dev` | Astro dev server at http://localhost:4321 |
| `npm run build` | Build to `dist/` — static `dist/client` + Worker `dist/server` (incl. generated `wrangler.json`) |
| `npm run preview` | `astro build && wrangler dev --config ./dist/server/wrangler.json` (workerd, closest to prod) |
| `npm run check` | `astro check` — the type gate (no separate lint or test suite) |
| `npm run types` | `wrangler types` → regenerate `worker-configuration.d.ts` (run after changing bindings in `wrangler.jsonc`) |
| `npm run deploy` | `astro build && wrangler deploy --config ./dist/server/wrangler.json` |

## Architecture — the non-obvious parts (mirrors the reference)

- **Two wrangler configs, never merged.** The root `wrangler.jsonc` is human-facing (`name`, `compatibility_date`, bindings) and feeds `wrangler types`/dev. It **intentionally omits `main` and `assets`** — declaring `main` there breaks `astro build`'s cfvite plugin. The `@astrojs/cloudflare` adapter injects them at build time into **`dist/server/wrangler.json`**, which is the real deploy artifact. Always deploy with `--config ./dist/server/wrangler.json`. Add a binding → edit root `wrangler.jsonc`, rebuild, it flows through.
- **Static-first.** All three pages prerender. This site has no forms/API in scope, so it should be fully static. If a lead/contact route is ever added, follow the reference's pattern: opt that one route out with `export const prerender = false`, keep it working without JS (native POST + query-param success panel), and progressively enhance — don't make pages SSR without a concrete runtime need.
- **www is canonical, enforced at the edge.** Set `site` in `astro.config.mjs` to `https://www.findthisbin.com` so `<link rel="canonical">` and the sitemap match the redirect target. Terraform 301s the apex → www (`redirect_apex_to_www`, as in the reference). The `site` value and the infra redirect must always agree — if you change the canonical host, change both together or the signals diverge.
- **Terraform owns edge config only — never the Worker script.** `infra/*.tf` manages custom-domain attachments, Always-Use-HTTPS, and the apex/www redirect. It must **not** declare a `cloudflare_workers_script` (that fights every `wrangler deploy`). Worker script/assets/bindings → wrangler; domains/HTTPS/redirect → Terraform; secrets → `wrangler secret put` / `.dev.vars` (never in Terraform state).

## Styling & conventions

- **Tokens are the single source of truth in `src/styles/global.css`.** DESIGN.md's color/typography/spacing tokens live in `:root { --* }`, with the reusable palette + font families bridged into Tailwind via `@theme` (`--color-*`, `--font-*`) so utilities like `bg-ink`, `text-violet`, `font-display` work. One-off values (the signature `clamp()` type/spacing, gradients, layered shadows, the `ftbGrad`/`ftbUp`/`ftbBlink`/`ftbFloat` keyframes) stay as plain CSS. Edit tokens here, never inline. Shared cross-page utilities (`.band*`, `.wrap*`, `.h1/.h2/.h3`, `.glow`, `.signature-gradient`, `[data-reveal]`) also live here; page-specific styling stays in each page's scoped `<style>`.
- **Centralize site-wide routes/labels/URLs in `src/lib/site.ts`** (site name, tagline, external "Get your free API key" / "Talk to sales" / sign-in / docs URLs — all placeholders for the future dashboard). Don't hardcode in pages.
- **Near-zero client JS, no UI framework runtime.** Six interactions, each a small scoped inline `<script>` (vanilla TS): (1) nav scroll-translucency + mobile menu (`SiteNav`), (2) Home stat counters (inline in `index.astro`), (3) Home "Try it live" BIN playground (`BinPlayground`), (4) code-language tab switchers (`CodeTabs`), (5) Pricing monthly/annual toggle, (6) Pricing FAQ accordion. The hero JSON staggered reveal is pure CSS (`ftbUp` + delays, `DemoPanel`). Code highlighting is build-time via Astro's `<Code>` (Shiki) with the custom theme in `src/lib/codeTheme.ts` — no client JS. Respect `prefers-reduced-motion`; the `<noscript>` fail-safe (Layout) and FAQ default-open keep JS-gated content visible without JS.
- **Honesty constraints on copy (per DESIGN.md):** SOC 2 is "in progress / roadmap" (not certified); GDPR-clean + DPA available; PCI out-of-scope (no PCI DSS certification claim); partner wordmarks and stat counters are placeholders. Keep these intact when editing copy.

## FindThisBIN-specific rules (from DESIGN.md — do not violate)

- **Never port `support.js` or the `.dc.html` inline styles into Astro.** `support.js` is a React-based "Design Component" runtime that loads React UMD from unpkg and renders `<x-dc>` templates (`{{ expr }}`, `<sc-if>`, `<sc-for>`, camelCased inline-style objects). The `.dc.html` files are visual + behavioral references only; their trailing `<script data-dc-script>` `class Component extends DCLogic` is the behavioral spec (the BIN-playground logic is reimplemented in `src/lib/bin.ts`). It is gitignored, not shipped.
- **Routing:** `Home.dc.html`→`/`, `Pricing.dc.html`→`/pricing`, `Docs.dc.html`→`/docs`. In-page anchors are preserved as section `id`s (`#try`, `#psp`, `#product`, `#tiers`, `#reference`, `#sdks`, `#company`, `#footer`).
- **Brand logos** from `design_files/logo_design_files/` are copied into `public/` (`favicon.svg`, `app-icon.svg`, `icon-*.svg`); the icon mark + "FindThis"(white)"BIN"(cyan) wordmark is the `Wordmark.astro` component used in nav/footer.
- **No raster images, and no trademarked third-party logos.** All other visuals are CSS gradients/glows/type. Card-scheme (VISA, Mastercard, …) and partner names render as plain text / generic motifs only.
- **Canonical API example** (`GET https://api.findthisbin.com/v1/bins/53847012` + its JSON response, in DESIGN.md) is reused everywhere code appears — the `DemoPanel`, the `CodeTabs` snippets, and the Docs reference panel.
- **Previewing a `.dc.html` reference:** the runtime does `fetch()` calls (its own source, sibling `./Name.dc.html`, React from unpkg), so serve `design_files/` over HTTP rather than opening via `file://`.

## Project structure

```
src/
  layouts/Layout.astro          ← <head> via BaseHead, SiteNav + <slot/> + SiteFooter, scroll-reveal + <noscript> fail-safe
  components/
    BaseHead.astro              ← <head>: meta, canonical, OG, self-hosted fonts
    SiteNav.astro               ← sticky nav (scroll-translucency + mobile menu), prop active: "home"|"pricing"|"docs"
    SiteFooter.astro            ← 5-col footer, EU pill, social icons
    Wordmark.astro              ← icon mark + FindThis/BIN wordmark
    Eyebrow.astro / Button.astro
    CodeTabs.astro              ← tabbed Shiki code panel (How it works, Docs quickstart)
    DemoPanel.astro             ← hero animated JSON response (pure-CSS stagger)
    BinPlayground.astro         ← "Try it live" island; renders via lib/bin.ts
  lib/
    site.ts                     ← site-wide routes/labels/URLs
    bin.ts                      ← BIN sample map + synthesis + card renderer (SSR default + client island)
    codeTheme.ts                ← custom Shiki theme (DESIGN.md code palette)
  pages/{index,pricing,docs}.astro
  styles/global.css             ← @import "tailwindcss"; :root tokens; @theme bridge; keyframes; shared utilities
public/                         ← brand logos (favicon/app-icon/icon-*.svg), og-default.svg, robots.txt
infra/                          ← Terraform (Cloudflare edge config only)
```

## Reference docs

- `DESIGN.md` — authoritative design spec (tokens, per-section page specs, copy, BIN-playground logic).
- `README.md` — project overview + quick start.
- `DEPLOYMENT.md` — full deploy runbook (ordering, token scopes, verification, rollback, Workers Builds CD).
- `../pathproof-marketing/` — sibling project on the same stack; the patterns here were copied from its `astro.config.mjs`, `wrangler.jsonc`, `global.css` token bridge, `site.ts`, `Layout.astro`, and `infra/`.
