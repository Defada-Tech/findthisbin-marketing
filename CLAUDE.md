# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Marketing site for **FindThisBIN** (findthisbin.com) — a **deployable BIN** (Bank Identification Number) **intelligence engine** that payment platforms (PSPs) run in their **own cloud** (self-hosted / BYOC, managed-in-your-cloud, or fully-managed BYOL), plugging in their own data licenses (Visa VBASS, Mastercard, commercial, CSV). It is sold as **enterprise infrastructure, not a self-serve hosted API** — there is no signup, no API-key flow, and no per-lookup pricing; the primary CTA everywhere is **"Book a demo"**.

**Ten pages** — Home (`/`), Product (`/product/`), Features (`/features/`), Company (`/company/`), a Contact / book-a-demo form (`/contact/`), four legal pages (`/privacy/`, `/terms/`, `/dpa/`, `/gdpr/`), and a branded `404` — sharing one nav, footer, and visual system, built as a **near-zero-JS, static-first site** on **Astro 6** and deployed to **Cloudflare Workers (Static Assets)**.

**Two routes are on-demand**, not one: `/api/contact` (posts form submissions to Slack) and `/contact/` itself, which is SSR so it renders the success/error pane from query params without JS. `astro.config.mjs` carries a `// pages: 10; ssr: 2` marker; `npm run conform` checks it against the filesystem, because the prose comment that preceded it was wrong for months.

**There is no `/pricing` and no `/docs`.** Earlier revisions of this file and README documented both, plus a "Pricing FAQ accordion" — none of it exists in the codebase. `design_files/Pricing.dc.html` and `Docs.dc.html` are prototypes for pages that were never built; treat them as historical, not as a backlog.

The site is built. The brand identity (palette, typography, gradient/glow motif, code panels, motion, font stack) is unchanged from the original brief — what changed in this v3 repositioning is messaging, page structure, and CTAs. The stack and conventions mirror the sibling project at `../pathproof-marketing`.

Source material:
- `DESIGN.md` — the design spec: design tokens, per-section page specs, copy, interaction logic, and the BIN-playground sample data + deterministic synthesis rules. Authoritative for **tokens, copy rules, and the playground logic**. Its **page specs are stale** — they still describe the pre-repositioning structure (Pricing/Docs pages that don't exist, no Features page). See the note at the top of that file before trusting a page section.
- `README.md` — project overview + quick start.
- `design_files/*.dc.html` — the original HTML design **references** (prototypes), not production code. `design_files/support.js` is a throwaway runtime (see below), gitignored.
- `design_files/logo_design_files/` — brand assets (`favicon.svg`, `app-icon.svg`, `icon-{color,mono-black,mono-white}.svg`, `FindThisBIN-brand-board.html`).

## Tech stack

- **Astro 6**, `output: "static"` (all pages prerender) + **`@astrojs/cloudflare`** adapter (`imageService: "passthrough"`, `prerenderEnvironment: "node"`).
- **Tailwind CSS v4** via `@tailwindcss/vite` (no `tailwind.config.*` — config lives in CSS).
- **`@astrojs/sitemap`**; `site` set to the canonical host.
- **Self-hosted fonts via the Astro Fonts API** (`fontProviders.google()` in `astro.config.mjs`) — *not* `<link>` to Google Fonts (DESIGN.md's `<link>` instruction predates this stack; self-host instead). Families (matched to the sibling `../pathproof-marketing`): **Space Grotesk** (display, 500/600/700), **IBM Plex Sans** (body/UI, 400/500/600/700), **IBM Plex Mono** (code/eyebrows, 400/500), each exposed as a `--ff-*` CSS variable.
- **TypeScript** strict (`extends: "astro/tsconfigs/strict"`).
- **Wrangler** for deploy; **Terraform** (`infra/`, Cloudflare provider `~> 5`) for edge config only.

## Commands

| Command | Does |
|---|---|
| `npm run dev` | Astro dev server at **http://localhost:4321** — pinned per site (pathproof is 4322). Both used to default to 4321, so running one after the other left a browser tab requesting the *other* repo's modules and produced `No cached compile metadata found for "/src/components/…"`. Different ports, no cross-talk. |
| `npm run build` | Build to `dist/` — static `dist/client` + Worker `dist/server` (incl. generated `wrangler.json`) |
| `npm run preview` | `astro build && wrangler dev --config ./dist/server/wrangler.json` (workerd, closest to prod) |
| `npm run check` | `astro check` — the type gate (no separate lint or test suite) |
| `npm run types` | `wrangler types` → regenerate `worker-configuration.d.ts` (run after changing bindings in `wrangler.jsonc`) |
| `npm run deploy` | `astro build && wrangler deploy --config ./dist/server/wrangler.json` |

## Architecture — the non-obvious parts (mirrors the reference)

- **Two wrangler configs, never merged.** The root `wrangler.jsonc` is human-facing (`name`, `compatibility_date`, bindings) and feeds `wrangler types`/dev. It **intentionally omits `main` and `assets`** — declaring `main` there breaks `astro build`'s cfvite plugin. The `@astrojs/cloudflare` adapter injects them at build time into **`dist/server/wrangler.json`**, which is the real deploy artifact. Always deploy with `--config ./dist/server/wrangler.json`. Add a binding → edit root `wrangler.jsonc`, rebuild, it flows through.
- **Static-first.** All pages prerender except **`/api/contact`** and **`/contact`**, which both carry `export const prerender = false` — two on-demand routes, not one. The `/contact` form works without JS (native POST → `/api/contact` → 303 redirect with a `?sent=1`/`?error=1` query-param success/error pane) and is progressively enhanced (fetch with `Accept: application/json`, in-place pane swap). The endpoint reads `SLACK_WEBHOOK_URL` via `import { env } from "cloudflare:workers"` and posts a Slack Block Kit message. Keep new pages prerendered — don't make a page SSR without a concrete runtime need.
- **www is canonical, enforced at the edge.** Set `site` in `astro.config.mjs` to `https://www.findthisbin.com` so `<link rel="canonical">` and the sitemap match the redirect target. Terraform 301s the apex → www (`redirect_apex_to_www`, as in the reference). The `site` value and the infra redirect must always agree — if you change the canonical host, change both together or the signals diverge.
- **Terraform owns edge config only — never the Worker script.** `infra/*.tf` manages custom-domain attachments, Always-Use-HTTPS, and the apex/www redirect. It must **not** declare a `cloudflare_workers_script` (that fights every `wrangler deploy`). Worker script/assets/bindings → wrangler; domains/HTTPS/redirect → Terraform; secrets → `wrangler secret put` / `.dev.vars` (never in Terraform state).

## Styling & conventions

- **Tokens are the single source of truth in `src/styles/global.css`.** DESIGN.md's color/typography/spacing tokens live in `:root { --* }`, with the reusable palette + font families bridged into Tailwind via `@theme` (`--color-*`, `--font-*`) so utilities like `bg-ink`, `text-violet`, `font-display` work. One-off values (the signature `clamp()` type/spacing, gradients, layered shadows, the `ftbGrad`/`ftbUp`/`ftbBlink`/`ftbFloat` keyframes) stay as plain CSS. Edit tokens here, never inline. Shared cross-page utilities (`.band*`, `.wrap*`, `.h1/.h2/.h3`, `.glow`, `.signature-gradient`, `[data-reveal]`) also live here; page-specific styling stays in each page's scoped `<style>`.
- **Centralize site-wide routes/labels/URLs in `src/lib/site.ts`** (site name, tagline, route paths, and the CTA labels+URLs). The primary CTA is **`BOOK_DEMO_*`** ("Book a demo" → `/contact/?intent=demo`); secondary are **`TALK_TO_SALES_*`** ("Talk to sales" → `/contact/?intent=sales`) and **`SEE_DEPLOYMENT_*`** ("See deployment options" → `/#deployment`). Those URLs are **derived** from `CONTACT_PATH`/`HOME_PATH` rather than spelled out, so the path is typed once and the trailing slash lands before the query string. `ENGINE_BASE_URL` (`https://bins.internal`) is the host shown in all code/demo URLs. Sign-in / docs / dashboard URLs remain external placeholders. There is **no** "Get your free API key" CTA. Don't hardcode in pages.
- **Near-zero client JS, no UI framework runtime.** Interactions are each a small scoped inline `<script>` (vanilla TS): (1) nav scroll-translucency + mobile menu (`SiteNav`), (2) Home "Try it live" BIN playground (`BinPlayground`), (3) code-language tab switchers (`CodeTabs`), (4) the `ContactForm` progressive-enhancement submit. (There is no pricing page, no FAQ accordion, and no monthly/annual toggle — pricing is contact-driven.) The hero JSON staggered reveal is pure CSS (`ftbUp` + delays, `DemoPanel`). Code highlighting is build-time via Astro's `<Code>` (Shiki) with the custom theme in `src/lib/codeTheme.ts` — no client JS. Respect `prefers-reduced-motion`; the `<noscript>` fail-safe (Layout) and the contact form's query-param success pane keep JS-gated content working without JS.

The one exception to "scoped scripts only" is `Analytics.astro`, which loads Cloudflare's beacon from its own origin and therefore must be `is:inline`. It renders **nothing** unless `CF_ANALYTICS_TOKEN` is set in `site.ts` — the same constant that widens the CSP, so the beacon can never ship without the policy that permits it.
- **Honesty constraints on copy (per DESIGN.md) — do not violate:** SOC 2 is "in progress / roadmap" (not certified); GDPR-clean + DPA available; PCI out-of-scope (no PCI DSS certification claim); no fabricated partner logos or dataset/scale metrics. The v3 prototypes *reintroduce* fabricated social proof (partner wordmarks NorthPay/Volt/…; invented counters "6.2M BINs", "242 countries", "184M lookups/day") and gradient stat bands — these are **intentionally not shipped** (no social-proof strip, no animated counters, no stat bands on Home/Product/Company). Only defensible claims appear inline (`sub-10ms p99`, `99.9% uptime`, `8-digit` precision, EU residency). Take the design files with a grain of salt; keep these constraints intact when editing copy.

## FindThisBIN-specific rules (from DESIGN.md — do not violate)

- **Never port `support.js` or the `.dc.html` inline styles into Astro.** `support.js` is a React-based "Design Component" runtime that loads React UMD from unpkg and renders `<x-dc>` templates (`{{ expr }}`, `<sc-if>`, `<sc-for>`, camelCased inline-style objects). The `.dc.html` files are visual + behavioral references only; their trailing `<script data-dc-script>` `class Component extends DCLogic` is the behavioral spec (the BIN-playground logic is reimplemented in `src/lib/bin.ts`). It is gitignored, not shipped.
- **Routing:** `Home.dc.html`→`/`, `Product.dc.html`→`/product/`, `Company.dc.html`→`/company/`, `Contact.dc.html`→`/contact/` (+ the `/api/contact/` endpoint). `Pricing.dc.html` and `Docs.dc.html` map to **nothing** — those pages were never built. `features.astro` ships with no `.dc.html` prototype behind it. Product and Company are standalone pages (not Home anchors). In-page anchors preserved as section `id`s: `#deployment`, `#try`, `#psp` (Home), `#careers` (Company), `#footer`.
- **URL form:** `trailingSlash: "always"`. Every `*_PATH` in `site.ts` carries the slash, and the CTA URLs are derived from `CONTACT_PATH` so the path is typed once. This includes the API route — `API_CONTACT_PATH` is `/api/contact/`, because a bare form action makes every submit pay a 308.
- **Contact intents:** `demo` (default; "Book a demo") and `sales` ("Talk to sales"). Any other value (incl. legacy `?intent=api-key`) falls through to `demo`. The contact form's **Deployment preference** `<select>` (field name `volume`) carries `Not sure yet` / `Self-hosted / BYOC` / `Managed in our cloud` / `Fully managed (BYOL)`; `/api/contact` posts it to Slack as `*Deployment preference:*` with `label = intent==="sales" ? "Talk to sales" : "Book a demo"`.
- **Brand logos** from `design_files/logo_design_files/` are copied into `public/` (`favicon.svg`, `app-icon.svg`, `icon-*.svg`); the icon mark + "FindThis"(white)"BIN"(cyan) wordmark is the `Wordmark.astro` component used in nav/footer.
- **No raster images, and no trademarked third-party logos.** All other visuals are CSS gradients/glows/type. Card-scheme (VISA, Mastercard, …) and partner names render as plain text / generic motifs only.
- **Canonical API example** (`GET https://bins.internal/v1/bins/53847012` + its JSON response, in DESIGN.md) is reused everywhere code appears — the `DemoPanel`, the `CodeTabs` snippets, and the Docs reference panel. The `bins.internal` host (the `ENGINE_BASE_URL` constant) signals self-hosting in *your* cloud rather than a hosted API.
- **Previewing a `.dc.html` reference:** the runtime does `fetch()` calls (its own source, sibling `./Name.dc.html`, React from unpkg), so serve `design_files/` over HTTP rather than opening via `file://`.

## Project structure

```
src/
  layouts/Layout.astro          ← <head> via BaseHead, SiteNav + <slot/> + SiteFooter, scroll-reveal + <noscript> fail-safe
  components/
    BaseHead.astro              ← <head>: meta, canonical, OG, self-hosted fonts
    SiteNav.astro               ← sticky nav (scroll-translucency + mobile menu); self-derives its active link from Astro.url.pathname — no `active` prop
    SiteFooter.astro            ← 5-col footer, EU pill, social icons
    Wordmark.astro              ← icon mark + FindThis/BIN wordmark
    Eyebrow.astro / Button.astro
    CodeTabs.astro              ← tabbed Shiki code panel (How it works, Docs quickstart)
    DemoPanel.astro             ← hero animated JSON response (pure-CSS stagger)
    BinPlayground.astro         ← "Try it live" island; renders via lib/bin.ts
    ContactForm.astro           ← contact form (intent switch, honeypot, JS-off fallback + PE submit)
  lib/
    site.ts                     ← site-wide routes/labels/URLs
    bin.ts                      ← BIN sample map + synthesis + card renderer (SSR default + client island)
    codeTheme.ts                ← custom Shiki theme (DESIGN.md code palette)
  pages/{index,product,features,company,contact}.astro
  pages/{privacy,terms,dpa,gdpr}.astro  ← legal
  pages/404.astro               ← branded not-found
  pages/api/contact.ts          ← on-demand (prerender=false) Slack-webhook endpoint
  styles/global.css             ← @import "tailwindcss"; :root tokens; @theme bridge; keyframes; shared utilities
public/                         ← brand logos (favicon/app-icon/icon-*.svg), og-default.svg, robots.txt
infra/                          ← Terraform (Cloudflare edge config only)
```

## Reference docs

- `DESIGN.md` — authoritative design spec (tokens, per-section page specs, copy, BIN-playground logic).
- `README.md` — project overview + quick start.
- `DEPLOYMENT.md` — full deploy runbook (ordering, token scopes, verification, rollback, Workers Builds CD).
- `../pathproof-marketing/` — sibling project on the same stack; the patterns here were copied from its `astro.config.mjs`, `wrangler.jsonc`, `global.css` token bridge, `site.ts`, `Layout.astro`, and `infra/`.
