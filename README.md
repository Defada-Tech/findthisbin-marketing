# FindThisBIN — marketing site

Marketing site for **FindThisBIN** (findthisbin.com), a **deployable BIN**
(Bank Identification Number) **intelligence engine** that payment platforms (PSPs)
run in their **own cloud** — self-hosted / BYOC, managed-in-your-cloud, or
fully-managed (BYOL), plugging in their own data licenses. It is sold as
enterprise infrastructure, not a self-serve hosted API: the primary action
everywhere is **"Book a demo"** (there is no signup or per-lookup pricing).

**Nine pages** — Home (`/`), Product (`/product/`), Features (`/features/`),
a Contact / book-a-demo form (`/contact/`), four legal pages (`/privacy/`,
`/terms/`, `/dpa/`, `/gdpr/`), and a branded `404` — built as a near-zero-JS
site on **Astro 6** and deployed to **Cloudflare Workers (Static Assets)**.
There is no Company page; the footer's Company column links the Enigma Soft
product family instead.

**Two routes are on-demand**, not one: `/api/contact` (posts submissions to
Slack) and `/contact/` itself, which is SSR so it can render the success/error
pane from query params without JavaScript. `astro.config.mjs` carries a
`// pages: 9; ssr: 2` marker that `npm run conform` checks against the
filesystem.

## Stack

- **Astro 6** — `output: "static"`, `trailingSlash: "always"`, `@astrojs/cloudflare` adapter
- **Tailwind CSS v4** via `@tailwindcss/vite` — design tokens live in `src/styles/global.css`
- **Self-hosted fonts** via the Astro Fonts API (Space Grotesk, IBM Plex Sans, IBM Plex Mono)
- **@astrojs/sitemap**, **TypeScript** (strict), **Wrangler** for deploy, **Terraform** for edge config

No UI framework runtime: the interactions (nav scroll/menu, BIN playground,
code-language tabs, and the progressively-enhanced contact form) are small
scoped vanilla scripts. Code
highlighting is build-time via Astro's Shiki with a custom theme
(`src/lib/codeTheme.ts`). The contact form works without JS (native POST →
`/api/contact` → 303 redirect with a query-param success/error pane).

## Commands

| Command | Does |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Astro dev server at http://localhost:4321 (pinned; pathproof uses 4322 so a stale tab from one site can't request the other's modules) |
| `npm run build` | Build to `dist/` — static `dist/client` + Worker `dist/server` (incl. generated `wrangler.json`) |
| `npm run preview` | Build, then serve the built Worker locally via `wrangler dev` (closest to prod) |
| `npm run check` | `astro check` — the type gate (no separate test suite) |
| `npm run conform` | `scripts/conform.mjs` — the conformance gate (MARKETING_TECH_STACK.md §12) |
| `npm run headers` | Regenerate `public/_headers` from `src/lib/securityHeaders.ts` |
| `npm run format` | Prettier over `.ts`/`.css` (`.astro` is excluded — see `.prettierignore`) |
| `npm run types` | `wrangler types` → regenerate `worker-configuration.d.ts` after changing bindings |
| `npm run deploy` | `astro build && wrangler deploy --config ./dist/server/wrangler.json` |

## Project structure

```
src/
  layouts/Layout.astro          ← <head> (BaseHead), SiteNav + <slot/> + SiteFooter, scroll-reveal
  layouts/LegalLayout.astro     ← shared shell for the four legal pages
  components/
    BaseHead.astro              ← SEO meta, OG, fonts, favicon
    SiteNav.astro / SiteFooter.astro / Wordmark.astro / Button.astro
    FinalCta.astro              ← the closing gradient CTA band on every page
    CodeTabs.astro              ← tabbed, Shiki-highlighted code panel
    DemoPanel.astro             ← hero animated JSON response
    BinPlayground.astro         ← "Try it live" interactive widget
    ContactForm.astro           ← contact form island (intent switch, JS-off fallback)
  lib/
    site.ts                     ← site-wide routes, labels, external URLs
    bin.ts                      ← BIN playground data + lookup/synthesis + card renderer
    codeTheme.ts                ← custom Shiki theme (mirrors the --code-* tokens)
    Analytics.astro             ← CF Web Analytics beacon; renders only if CF_ANALYTICS_TOKEN env var is set at build time
  lib/
    securityHeaders.ts          ← the §10 header set; single source for _headers + middleware
  middleware.ts                 ← applies the §10 headers to SSR responses (_headers misses them)
  pages/{index,product,features,contact}.astro
  pages/{privacy,terms,dpa,gdpr}.astro  ← legal (LegalLayout)
  pages/404.astro               ← branded not-found
  pages/api/contact.ts          ← SSR endpoint (prerender=false) → Slack webhook
  styles/global.css             ← design tokens, @theme bridge, keyframes, shared utilities
public/                         ← brand logos, og-default.png (+ .svg source), robots.txt, _headers
scripts/conform.mjs             ← conformance gate; scripts/headers.mjs regenerates _headers
infra/                          ← Terraform (Cloudflare edge config only)
```

## Deploy

The site deploys to Cloudflare Workers Static Assets.

1. **Worker** (script + assets): `npm run deploy`. The `@astrojs/cloudflare`
   adapter writes the real deploy config to `dist/server/wrangler.json`; the
   root `wrangler.jsonc` is human-facing and intentionally omits `main`/`assets`.
   The contact form needs the `SLACK_WEBHOOK_URL` secret set once via
   `npx wrangler secret put SLACK_WEBHOOK_URL` (locally, copy `.dev.vars.example`
   → `.dev.vars`). Without it the form returns a friendly error and logs the lead.

   For analytics, export `CF_ANALYTICS_TOKEN` before building (`cd infra && tofu
   output -raw cf_analytics_token`). When unset, analytics stays off.
2. **Edge config** (custom domains, Always-HTTPS, apex→www redirect): `cd infra
   && tofu init && tofu apply` with a scoped `CLOUDFLARE_API_TOKEN` exported.
   Terraform owns edge config only — never the Worker script.

**www is canonical.** `site` in `astro.config.mjs` is `https://www.findthisbin.com`
to match the apex→www 301 the infra sets up. Change both together if the
canonical host changes.

See **`DEPLOYMENT.md`** for the full runbook (prerequisites, ordering, token scopes, verification, rollback, Workers Builds CD).

## Content roadmap

[ROADMAP.md](ROADMAP.md) compares FindThisBIN with BINLookupAPI and prioritizes
content accuracy, technical evaluation, commercial clarity, and focused guides.
It describes planned website work; the routes and capabilities listed there are
not a statement of what is currently shipped.

## Design source of truth

- **`DESIGN.md`** — the design spec: positioning, tokens, per-section page specs,
  copy, CTA wiring, and the BIN-playground logic. Records the honesty constraints
  (no fabricated partner logos or scale metrics; SOC 2 "in progress"). Its page
  specs match the codebase as of the 2026-08 refinement pass; the struck-through
  Pricing / Docs / Company sections are historical. See the note at the top of
  that file.
- **`../MARKETING_TECH_STACK.md`** — the cross-site stack standard this repo
  conforms to. `npm run conform` enforces the mechanical parts.
- **`design_files/*.dc.html`** — the HTML design references (prototypes; not shipped) + `findthisbin-design-addendum.md` (the v3 repositioning deltas). `design_files/support.js` is the prototype runtime and is gitignored.

See **`CLAUDE.md`** for architecture notes and conventions.
