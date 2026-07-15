# FindThisBIN — marketing site

Marketing site for **FindThisBIN** (findthisbin.com), a **deployable BIN**
(Bank Identification Number) **intelligence engine** that payment platforms (PSPs)
run in their **own cloud** — self-hosted / BYOC, managed-in-your-cloud, or
fully-managed (BYOL), plugging in their own data licenses. It is sold as
enterprise infrastructure, not a self-serve hosted API: the primary action
everywhere is **"Book a demo"** (there is no signup or per-lookup pricing). Six
pages — Home (`/`), Product (`/product`), Pricing (`/pricing`), Docs (`/docs`),
Company (`/company`), and a Contact / book-a-demo form (`/contact`) — built as a
near-zero-JS site on **Astro 6** and deployed to **Cloudflare Workers (Static
Assets)**. Every page prerenders except the contact form's `/api/contact`
endpoint, the one on-demand route (it posts submissions to Slack).

## Stack

- **Astro 6** — `output: "static"` (all pages prerender; `/api/contact` opts out with `prerender = false`), `@astrojs/cloudflare` adapter
- **Tailwind CSS v4** via `@tailwindcss/vite` — design tokens live in `src/styles/global.css`
- **Self-hosted fonts** via the Astro Fonts API (Space Grotesk, IBM Plex Sans, IBM Plex Mono)
- **@astrojs/sitemap**, **TypeScript** (strict), **Wrangler** for deploy, **Terraform** for edge config

No UI framework runtime: the interactions (nav scroll/menu, BIN playground,
code-language tabs, pricing FAQ accordion, and the
progressively-enhanced contact form) are small scoped vanilla scripts. Code
highlighting is build-time via Astro's Shiki with a custom theme
(`src/lib/codeTheme.ts`). The contact form works without JS (native POST →
`/api/contact` → 303 redirect with a query-param success/error pane).

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
    ContactForm.astro           ← contact form island (intent switch, JS-off fallback)
  lib/
    site.ts                     ← site-wide routes, labels, external URLs
    bin.ts                      ← BIN playground data + lookup/synthesis + card renderer
    codeTheme.ts                ← custom Shiki theme (README palette)
  pages/{index,product,pricing,docs,company,contact}.astro
  pages/api/contact.ts          ← SSR endpoint (prerender=false) → Slack webhook
  styles/global.css             ← design tokens, @theme bridge, keyframes, shared utilities
public/                         ← brand logos, og-default.svg, robots.txt
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
2. **Edge config** (custom domains, Always-HTTPS, apex→www redirect): `cd infra
   && tofu init && tofu apply` with a scoped `CLOUDFLARE_API_TOKEN` exported.
   Terraform owns edge config only — never the Worker script.

**www is canonical.** `site` in `astro.config.mjs` is `https://www.findthisbin.com`
to match the apex→www 301 the infra sets up. Change both together if the
canonical host changes.

See **`DEPLOYMENT.md`** for the full runbook (prerequisites, ordering, token scopes, verification, rollback, Workers Builds CD).

## Design source of truth

- **`DESIGN.md`** — the full v3 design spec: positioning, tokens, per-section page specs, copy, CTA wiring, and the BIN-playground logic. Records the honesty constraints (no fabricated partner logos or scale metrics; SOC 2 "in progress").
- **`design_files/*.dc.html`** — the HTML design references (prototypes; not shipped) + `findthisbin-design-addendum.md` (the v3 repositioning deltas). `design_files/support.js` is the prototype runtime and is gitignored.

See **`CLAUDE.md`** for architecture notes and conventions.
