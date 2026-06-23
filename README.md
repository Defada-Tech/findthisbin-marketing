# FindThisBIN — marketing site

Marketing site for **FindThisBIN** (findthisbin.com), a developer-first BIN
(Bank Identification Number) intelligence API for payment platforms. Three
pages — Home (`/`), Pricing (`/pricing`), Docs (`/docs`) — built as a
near-zero-JS static site on **Astro 6** and deployed to **Cloudflare Workers
(Static Assets)**.

## Stack

- **Astro 6** — `output: "static"` (all pages prerender), `@astrojs/cloudflare` adapter
- **Tailwind CSS v4** via `@tailwindcss/vite` — design tokens live in `src/styles/global.css`
- **Self-hosted fonts** via the Astro Fonts API (Space Grotesk, Inter, JetBrains Mono)
- **@astrojs/sitemap**, **TypeScript** (strict), **Wrangler** for deploy, **Terraform** for edge config

No UI framework runtime: the six interactions (nav scroll/menu, stat counters,
BIN playground, code-language tabs, pricing toggle, FAQ accordion) are small
scoped vanilla scripts. Code highlighting is build-time via Astro's Shiki with a
custom theme (`src/lib/codeTheme.ts`).

## Commands

| Command | Does |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Astro dev server at http://localhost:4321 |
| `npm run build` | Build to `dist/` — static `dist/client` + Worker `dist/server` (incl. generated `wrangler.json`) |
| `npm run preview` | Build, then serve the built Worker locally via `wrangler dev` (closest to prod) |
| `npm run check` | `astro check` — the type gate (no separate test suite) |
| `npm run types` | `wrangler types` → regenerate `worker-configuration.d.ts` after changing bindings |
| `npm run deploy` | `astro build && wrangler deploy --config ./dist/server/wrangler.json` |

## Project structure

```
src/
  layouts/Layout.astro          ← <head> (BaseHead), SiteNav + <slot/> + SiteFooter, scroll-reveal
  components/
    BaseHead.astro              ← SEO meta, OG, fonts, favicon
    SiteNav.astro / SiteFooter.astro / Wordmark.astro
    Eyebrow.astro / Button.astro
    CodeTabs.astro              ← tabbed, Shiki-highlighted code panel
    DemoPanel.astro             ← hero animated JSON response
    BinPlayground.astro         ← "Try it live" interactive widget
  lib/
    site.ts                     ← site-wide routes, labels, external URLs
    bin.ts                      ← BIN playground data + lookup/synthesis + card renderer
    codeTheme.ts                ← custom Shiki theme (README palette)
  pages/{index,pricing,docs}.astro
  styles/global.css             ← design tokens, @theme bridge, keyframes, shared utilities
public/                         ← brand logos, og-default.svg, robots.txt
infra/                          ← Terraform (Cloudflare edge config only)
```

## Deploy

The site deploys to Cloudflare Workers Static Assets.

1. **Worker** (script + assets): `npm run deploy`. The `@astrojs/cloudflare`
   adapter writes the real deploy config to `dist/server/wrangler.json`; the
   root `wrangler.jsonc` is human-facing and intentionally omits `main`/`assets`.
2. **Edge config** (custom domains, Always-HTTPS, apex→www redirect): `cd infra
   && tofu init && tofu apply` with a scoped `CLOUDFLARE_API_TOKEN` exported.
   Terraform owns edge config only — never the Worker script.

**www is canonical.** `site` in `astro.config.mjs` is `https://www.findthisbin.com`
to match the apex→www 301 the infra sets up. Change both together if the
canonical host changes.

See **`DEPLOYMENT.md`** for the full runbook (prerequisites, ordering, token scopes, verification, rollback, Workers Builds CD).

## Design source of truth

- **`DESIGN.md`** — the full design spec: tokens, per-section page specs, copy, and the BIN-playground logic.
- **`design_files/*.dc.html`** — the original HTML design references (prototypes; not shipped). `design_files/support.js` is the prototype runtime and is gitignored.

See **`CLAUDE.md`** for architecture notes and conventions.
