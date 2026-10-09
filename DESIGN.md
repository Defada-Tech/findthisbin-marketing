# FindThisBIN Marketing Site — Design Spec (v3, enterprise infrastructure)

> ## Status note (updated 2026-08, whole-site refinement pass)
>
> **This file is authoritative for tokens, the type scale, copy rules, CTA
> wiring, and the BIN-playground logic — and the per-page sections below now
> match `src/pages/` again** (re-authored in the 2026-08 refinement pass, which
> consolidated Home 12→10 sections, gave Product the spec-sheet/stepper layouts,
> and rebuilt Features as the capability atlas; a follow-up in the same pass
> removed the Company page and the careers intent, removed all eyebrow labels,
> and pointed the footer's Company column at the Enigma Soft family).
>
> Still true and worth repeating:
>
> - **There is no Pricing page, no Docs page, and no Company page.** The
>   `~~Pricing~~` / `~~Docs~~` / `~~Company~~` sections are struck through and
>   kept for reference only.
> - Nav self-derives its active link from `Astro.url.pathname`; pages pass nothing.
> - `npm run conform` checks the page list against the filesystem
>   (`// pages: 9; ssr: 2` in `astro.config.mjs`).


> **Positioning (v3).** FindThisBIN is a **deployable BIN intelligence engine** that payment platforms (PSPs) run in their **own cloud** — self-hosted / BYOC, managed-in-your-cloud, or fully-managed (BYOL). Customers **bring their own data licenses** (Visa VBASS, Mastercard BIN table, commercial feeds, CSV); we provide the engine, the 8-digit logic, the multi-source merge, the sub-10ms hot path, and the ops. This is **not** a self-serve hosted API — there is no signup, no API-key flow, and no per-lookup pricing. The bold fintech identity (palette, typography, gradient/glow motif, code panels, motion, font stack) is **unchanged** from the original brief; what changed is messaging, page structure, and CTAs. This document is the authoritative spec; the refreshed `design_files/*.dc.html` prototypes are the visual reference, and `design_files/findthisbin-design-addendum.md` records the repositioning deltas.

## Overview
A bold, modern, **multi-page marketing site** for **FindThisBIN** (findthisbin.com) aimed at **infrastructure buyers** — both the platform decision-maker (compliance, data residency, build-vs-buy, time-to-value) and their engineers (clean API, deploy in your stack).

**The pages that actually ship:**

1. **Home / landing** (`/`)
2. **Product** (`/product/`) — product/feature deep-dive
3. **Features** (`/features/`) — capability atlas + deployment-model comparison
4. **Contact / Book-a-demo** (`/contact/`) — the form behind the CTAs (demo · sales intents); posts a Slack message via webhook (`/api/contact/`)
5. **Legal** — `/privacy/`, `/terms/`, `/dpa/`, `/gdpr/`
6. **404** — branded not-found

There is no Pricing page, no Docs page, and no Company page.
`design_files/Pricing.dc.html` and `Docs.dc.html` are prototypes for pages that
were never built; `Company.dc.html` is the prototype for a page that shipped and
was later removed (no company/careers story on this site).

**Messaging priority (new order):** (1) deploy in your cloud / we handle the ops, (2) compliance & data residency (your data never leaves; out of PCI scope and the card/data path), (3) build-vs-buy / time-to-value, (4) correctness & performance (8-digit, multi-source, sub-10ms), with developer experience reframed as "your team integrates a clean API." Fraud stays a minor supporting use case.

**Honesty constraints (do not violate).** No fabricated social proof: **no partner/customer wordmarks** and **no invented scale metrics** (e.g. "6.2M BINs", "242 countries", "184M lookups/day"). The prototypes reintroduce these as illustrative placeholders — they are intentionally **not shipped** (no social-proof strip, no animated counters, no fabricated stat bands on Home / Product). Only defensible, repeatable claims appear inline: `sub-10ms p99`, `99.9% uptime`, `8-digit` precision, EU residency. SOC 2 is "in progress / roadmap" (never "certified"); GDPR-clean + DPA available; PCI **out of scope** (no PCI DSS certification claim). Card-scheme names render as plain text / generic motifs — never trademarked logos.

## Stack & build
Built as a static, prerendered **Astro 6** site (`output: "static"`) on the `@astrojs/cloudflare` adapter, Tailwind v4 (config-in-CSS), self-hosted fonts via the Astro Fonts API. Every page prerenders except the on-demand `/contact/` (reads query params) and **`/api/contact/`** (`prerender = false`, the Slack-webhook endpoint) — two on-demand routes. `trailingSlash: "always"`; every path carries the slash. See `README.md` / `CLAUDE.md` for commands, the two-wrangler-config setup, and the deploy runbook (`DEPLOYMENT.md`).

**Routing & anchors:** `Home`→`/`, `Product`→`/product/`, `Features`→`/features/`, `Contact`→`/contact/` (+ `/api/contact/`). In-page anchors preserved as section `id`s: `#deployment`, `#try`, `#psp`, `#product` (Home), `#tiers` (Features), `#footer`.

## About the Design Files
`design_files/*.dc.html` are **design references** authored in a streaming "Design Component" format (`*.dc.html` + the gitignored `support.js` runtime) using inline-style objects. They are visual + behavioral references only — **do not port** the inline styles or the `.dc.html`/`support.js` runtime into Astro. The shipped Astro site is the source of truth; where a prototype reintroduces a fabricated stat or partner name, the site (and the honesty constraints above) win.

---

## Design Tokens

### Colors
| Token | Hex | Use |
|---|---|---|
| `--ink` | `#0B0B12` | Primary dark background; headings on light |
| `--ink-2` | `#0C0C16` | Code/demo panel background |
| `--ink-3` | `#10101C` | Cards inside dark panels |
| `--ink-4` | `#08080E` | Footer background |
| `--ink-soft` | `#12121E` | Code panel header bars |
| `--violet` | `#7C5CFF` | Primary accent (links, accents) |
| `--violet-light` | `#A98BFF` | Accent text on dark, gradient text |
| `--indigo` | `#6366F1` | Gradient mid-stop |
| `--blue` | `#3B82F6` | Gradient end-stop |
| `--cyan` | `#22D3EE` | Signature highlight ("BIN" in wordmark, trust dots, secondary accent) |
| `--lime` | `#C4F542` | Primary CTA button fill; "popular" badge; on-dark highlights |
| `--white` | `#FFFFFF` | Light section background |
| `--off-white` | `#F6F6FB` | Alternating light section background |
| `--surface-light` | `#F0F0F6` | Secondary button fill on light |
| `--border-light` | `#E6E6EF` | Borders on light surfaces |
| `--border-light-2` | `#EEEEF3` | Table row dividers |
| `--text-light-body` | `#5A5A6B` / `#4A4A57` | Body text on light |
| `--text-light-muted` | `#6E6E80` / `#8A8A9A` | Muted/labels on light |
| `--text-dark-body` | `#A9A9BC` | Body text on dark |
| `--text-dark-muted` | `#9A9AAE` / `#7A7A8C` | Muted text on dark |
| `--text-dark-faint` | `#5C5C6E` | Uppercase labels on dark |
| `--border-dark` | `rgba(255,255,255,0.08)` | Borders on dark surfaces |
| `--check-green` | `#1FA463` | Table checkmarks; status dot |

**Signature gradient** (CTA fills, volume callout, confidence bar):
`linear-gradient(115deg, #7C5CFF, #6366F1 45%, #3B82F6)` — animated via `background-size:200% 200%` + `ftbGrad` keyframe (14s ease infinite).

**Glow blobs:** `radial-gradient(circle, rgba(124,92,255,0.45), transparent 70%)` with `filter:blur(14–30px)`, absolutely positioned behind hero/CTA sections.

### Typography
Self-hosted via the Astro Fonts API (`fontProviders.google()` in `astro.config.mjs`), **not** `<link>` to Google Fonts. Families exposed as CSS vars: `--ff-display` (**Space Grotesk**, 500/600/700, headings), `--ff-body` (**IBM Plex Sans**, 400/500/600/700, body/UI), `--ff-mono` (**IBM Plex Mono**, 400/500, code).

| Role | Family | Weight | Size | Tracking | Line-height |
|---|---|---|---|---|---|
| Hero H1 | Space Grotesk | 700 | `clamp(40px,6vw,72px)` | `-0.03em` | 1.02 |
| Page H1 (secondary pages) | Space Grotesk | 700 | `clamp(36px,5.5vw,64px)` | `-0.03em` | 1.03 |
| Section H2 | Space Grotesk | 700 | `clamp(30px,4.2vw,48px)` | `-0.025em` | 1.05 |
| Card title H3 | Space Grotesk | 700 | 26px | `-0.02em` | 1.1 |
| Body | IBM Plex Sans | 400 | `clamp(16px,1.7vw,19px)` | normal | 1.6 |
| Small / meta | IBM Plex Sans | 500 | 13–14px | normal | 1.5 |
| Code | IBM Plex Mono | 400–500 | 12.5–13px | normal | 1.7–1.8 |

### Spacing & shape
- Section vertical padding: `clamp(56px,7vw,96px)` to `clamp(64px,8vw,112px)`.
- Content max-width: `1240px` (marketing), `1100px` (Docs body), `820–920px` (centered headers/FAQ). Side padding `24px`.
- Border radius: pills `999px`; buttons `10–12px`; cards `14–18px`; large callouts `20px`; code panels `16px`; inner code lines `9px`.
- Shadows: button glow `0 12px 36px -10px rgba(196,245,66,0.6)`; popular/highlighted card `0 30px 70px -28px rgba(124,92,255,0.7)`; demo panel `0 30px 80px -30px rgba(0,0,0,0.8)`.

### Keyframes
```css
@keyframes ftbGrad { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
@keyframes ftbUp   { from{opacity:0; transform:translateY(12px)} to{opacity:1; transform:translateY(0)} }
@keyframes ftbBlink{ 0%,100%{opacity:1} 50%{opacity:0} }
@keyframes ftbFloat{ 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
```

### Code syntax-highlight palette (dark panels)
| Token | Hex |
|---|---|
| JSON key / property | `#7DD3FC` |
| string / URL | `#9EE493` |
| boolean / number | `#C4A5FF` |
| punctuation / brackets | `#717184` |
| keyword (`const`,`import`,`from`,`new`,`await`) | `#FF7B9C` |
| function / method | `#B89CFF` |
| comment | `#5C5C6E` |
| plain identifier | `#E6E6F0` |
| HTTP verb badge | `GET` = lime `#C4F542` bg (or cyan `#22D3EE` on Docs ref), text `#0B0B12` |

---

## Shared components

### Nav (`SiteNav.astro`)
- Sticky, `top:0`, `z-index:1000`, `height:68px`, `backdrop-filter:blur(14px)`.
- Background changes on scroll: `rgba(11,11,18,0.32)` → `rgba(11,11,18,0.85)` once `window.scrollY > 12`, bottom border fading in. *(inline script)*
- Left: wordmark **FindThis**(white)**BIN**(cyan). Center links: Product / Features. The active link is **self-derived** from `Astro.url.pathname` (normalized on both sides) and marked with `aria-current="page"` — there is no `active` prop; pages pass nothing.
- Right: primary **"Book a demo"** button → `/contact/?intent=demo` (lime fill, glow). *(There is no "Sign in" link in the shipped nav.)*
- **Mobile (≤860px):** hamburger toggles a full-width panel with stacked links. *(inline script)*

### Footer (`SiteFooter.astro`)
- Background `#08080E`, 4-col grid (`1.6fr 1fr 1fr 1fr` → `1fr 1fr` ≤900px), `id="footer"`.
- Col 1: wordmark, tagline **"The BIN intelligence engine for payment platforms. Deploy it in your own cloud; your data never leaves."**, and a cyan **"Runs in your cloud · EU option"** pill.
- Columns: **Product** (Overview · Try it live → `/#try` · Features · Deployment models → `/#deployment` · Contact) · **Company** — the Enigma Soft family, all external (`site.ts` `FAMILY_LINKS`): Enigma Soft → `https://www.enigmasoft.ltd.uk` · Pathproof → `https://www.trypathproof.com` · ChargebackHQ → `https://www.trychargebackhq.com` · 3DSCore → `https://www.enigmasoft.ltd.uk` · **Legal** (Privacy, Terms, DPA, GDPR).
- Bottom bar: "© 2026 FindThisBIN. All rights reserved." left, "an Enigma Soft product" link → `PARENT_URL` right. *(No social icons; none exist as assets.)*

---

## Page 1 — Home (`index.astro`)
Sections, in order (alternating dark / light; social-proof + stat-band sections intentionally omitted). The 2026-08 pass consolidated 12 sections → 10: the build-vs-buy and compliance pillar cards folded into their dedicated sections, and the use-case grid merged into the PSP section.

1. **Hero** (dark). Pill ("Self-hosted · Managed · Fully managed", lime dot). H1 **"The BIN intelligence engine that runs in your cloud."** — "your cloud." gradient-clipped. Subhead: "Built for payment platforms. Plug in your data licenses; get 8-digit card records at sub-10ms. Your data never leaves." Dual CTA: **Book a demo** (lime) + **See deployment options** (ghost → `#deployment`). Trust strip (cyan `●`): **Runs in your cloud · Your data never leaves · Out of PCI scope · EU-hosted option · sub-10ms p99**. Right column is the **deployment-motif demo panel** (`DemoPanel.astro`):
   - Window chrome `findthisbin-engine · your-cloud`; a dashed "your cloud" box headed `your cloud · eu-west-1 · vpc` / `data stays here`.
   - Deployment flow: licensed sources (`VBASS` · `Mastercard` · `CSV`) → engine (`FindThisBIN engine` / "8-digit · multi-source merge") → output (`your API`, lime).
   - Request line: lime `GET` badge + `https://bins.internal/v1/bins/53847012` (BIN in cyan).
   - Canonical JSON body, each line `ftbUp` staggered (0.05s → 0.72s) + blinking lime caret.
   - Scheme strip: "Coverage across every major scheme" + VISA / Mastercard / AMEX / Discover / JCB / UnionPay as **plain greyscale text**.
2. **Value pillars** (`id="product"`, white). H2 "Engineered for the teams that move money." Two large dark cards (was a 2×2 clone of Product's capabilities):
   - "Run it where your data lives." + `helm install` mini-snippet.
   - "Correct data, on the hot path." + stats `<10ms` p99 · `8-digit`.
3. **Deployment models** (`id="deployment"`, dark). H2 "One engine. You choose who runs it." 3 cards — **Self-hosted / BYOC** · **Managed in your cloud** *(highlighted, lime "most popular" chip + violet border)* · **Fully managed (BYOL)** — each with a checklist (lime ✓ on cards 1 & 3, cyan ✓ on the highlighted card). Section CTA "Book a demo" + text link "Compare deployment options →" → `/features/`.
4. **Bring your own licenses / connectors** (white). H2 "Plug in your licenses. We did the hard logic." Body + provider-brokerage line. CTA **Talk to sales** → sales. Connector list: VBASS · Mastercard BIN table · Commercial providers · CSV upload · **Bundled open seed data** (highlighted, lime badge, "works on day one"). Foot: dashed-violet **POC strip** ("Proof of concept" mono tag + one line + "Book a demo →" link).
5. **Try it live + what you get** (`id="try"`, dark, `.grid-texture` blueprint overlay). H2 "Look up any BIN, right now." Interactive `BinPlayground.astro` (see logic below). Below, in the same band: H3 "Every field your stack needs." + grid of 13 dark field chips (`dcc_eligible` & `confidence` highlighted cyan). CTA **Book a demo**.
6. **Build vs. buy** (white). H2 "Months of specialist work, or a deployment this week." Two columns — **Build it in-house** (✕, muted) vs **Deploy the engine** (✓, lime, dark card), 5 items each.
7. **For payment platforms** (`id="psp"`, dark, violet glow). H2 "Embed card intelligence across your entire stack." 2-col: copy + CTAs (Talk to sales / See features → `/features/`) | six `↳` rows — the merged use-case list (Least-cost & debit routing · Surcharging & interchange · DCC eligibility (EU) · Checkout UX & card art · Fraud & risk signals · Batch data enrichment).
8. **How it works** (dark). H2 "Three steps to production." 2-col: 3 numbered steps (**Deploy in your cloud → Connect your licenses → Integrate the API**) | code panel with language tabs (cURL / Node / Python / Go / PHP), all targeting `https://bins.internal`, status-line footer `→ 200 OK · scheme: "mastercard" · confidence: 0.98`.
9. **Compliance & residency** (white). Rounded off-white panel with its own headline — H2 "Your data never leaves." + sub — then a 4-up grid: Your environment · Out of the data path · Out of PCI scope · DPA & EU option.
10. **Final CTA** (`FinalCta.astro`, gradient + violet glow). H2 **"Run BIN intelligence in your own cloud."** + lead + Book a demo / Talk to sales.

**Footer** follows on every page.

## ~~Page 2 — Pricing (`pricing.astro`)~~ — ⚠ NOT BUILT. Historical; kept for reference only.
Contact-driven enterprise tiers — **no monthly/annual toggle, no per-lookup prices**.

1. **Header** (dark, violet glow). Pill "Deployment-based pricing · Runs in your cloud". H1 "Pricing that fits your deployment." Subhead (scope around volume/connectors/SLAs/residency + POC).
2. **Tiers** (`id="tiers"`, off-white). 3 cards (`repeat(3,1fr)` → `1fr` ≤920px), **Growth** highlighted dark with "MOST POPULAR" badge. Each: name, audience line, price ("Let's talk" / "Custom") + sub-label, CTA (**Request pricing** / **Talk to sales**, all → `/contact?intent=sales`), feature ✓ list. Copy in `Pricing.dc.html`.
3. **POC callout** (white). Dashed-violet panel, mono eyebrow "Proof of concept", H2 "Evaluate with a POC in your own cloud.", copy, CTA **Book a demo** → demo.
4. **Comparison table** (off-white). H2 "Compare every plan." Horizontally scrollable (`min-width:720px`), columns Startup / **Growth** (violet) / Enterprise. 16 **infrastructure rows** — render `✓` green, `—` muted dash, text values bold:
   - Self-hosted / BYOC: ✓ | ✓ | ✓
   - Managed in your cloud: — | ✓ | ✓
   - Fully-managed (BYOL): — | — | ✓
   - Included connectors: Base | Extended | Premium
   - Bundled seed data: ✓ | ✓ | ✓
   - 8-digit range data + confidence: ✓ | ✓ | ✓
   - DCC module: — | ✓ | ✓
   - Surcharging & interchange intelligence: — | ✓ | ✓
   - Network-token indicators: — | ✓ | ✓
   - Data stays in your environment: ✓ | ✓ | ✓
   - Uptime SLA: — | 99.9% | Custom
   - Managed operations: — | Optional | ✓
   - Support level: Community | Standard | Dedicated
   - Dataset export: — | — | ✓
   - DPA: ✓ | ✓ | ✓
   - SOC 2: Roadmap | Roadmap | ✓
5. **Volume callout** (signature-gradient panel on dark). H2 "Multiple environments, regions, or a managed rollout?" + "Talk to sales" white button.
6. **FAQ accordion** (off-white, max-width 820). 8 items, single-open (first open by default), no-JS shows all. Deployment / data-residency / card-data / hosting / licenses / POC / pricing-model / air-gapped questions — verbatim in `Pricing.dc.html`.
7. **Close** (gradient + glow). Trust strip (Runs in your cloud · Your data never leaves · Out of PCI scope · DPA available) + H2 "Book a demo today." + Book a demo / Talk to sales.
8. **Footer.**

## ~~Page 3 — Docs (`docs.astro`)~~ — ⚠ NOT BUILT. Historical; kept for reference only.
1. **Header** (off-white, bottom border). Mono eyebrow `// docs`. H1 "Build with FindThisBIN." Subhead "From deploying the engine in your cloud to your first lookup — in minutes." Cosmetic search bar (`⌘K`).
2. **Quickstart** (white). 2-col: dark gradient card with "15-minute quickstart" pill, H2 "Deploy in your cloud in 15 minutes.", 3 steps (**Deploy the engine → Connect a data source → Make your first lookup**), "Start here" CTA → demo | code panel with tabs (cURL / Node / Python) targeting `https://bins.internal`, "→ 200 OK …" footer.
3. **Documentation grid** (off-white). `repeat(3,1fr)` → 2 → 1. 15 cards (mono token + title + one line): Quickstart, **Deployment**, **Connecting data sources**, **License configuration**, **Tenant setup**, **Upgrades & operations**, **Observability**, Authentication, BIN Lookup API (→ `#reference`), Batch Lookup, DCC endpoint, Webhooks, Errors & rate limits, Data dictionary, Versioning.
4. **SDKs & tools** (`id="sdks"`, white). "OpenAPI spec ↓" / "Postman collection →" links + 5 SDK install cards (Node/Python/Go/PHP/Java) + a gradient "All SDKs are open source / View on GitHub" card.
5. **API reference** (`id="reference"`, dark). 2-col: copy ("Integrate the engine you've deployed…") + "Open reference" CTA | code panel `GET /v1/bins/{bin}` (cyan verb badge, `{bin}` violet) + abbreviated JSON.
6. **Guides** (off-white). H2 "Guides." 4 link rows.
7. **Docs utility bar** (white, top border). Status (green dot) · Changelog · Support + persistent **"Book a demo"** lime CTA.
8. **Footer.**

## Page 4 — Product (`product.astro`)
The "engine spec sheet" page — left-aligned and mono-forward, visually distinct from Home's split hero.
1. **Hero** (dark, left-aligned). Pill "Product". H1 "The card-intelligence layer for **payment platforms.**" Subhead opens on deploy-in-your-cloud / BYOL. Dual CTA (Book a demo / Talk to sales). Below the CTAs, the **request bar**: a wide dark panel with a lime `GET` chip + `https://bins.internal/v1/bins/53847012` (BIN in cyan, blinking lime caret) + right-aligned mono status `→ 200 OK · sub-10ms`.
2. **Anatomy of a lookup** (white). 2-col: copy ("the engine running in your environment") + 4 grouped bullets (Identity / Issuer / Flags & DCC / Provenance) | dark code panel (`findthisbin-engine · your-cloud`, `GET https://bins.internal/v1/bins/53847012`) + canonical JSON + status-line footer `→ 200 OK · scheme: "mastercard" · confidence: 0.98`.
3. **Spec sheet** (off-white). H2 "Four things we obsess over." Four stat tiles — **<10ms** p99 lookup latency · **99.9%** uptime target · **8-digit** range precision · **EU** residency option — each with a mono label + one line. (All four are the site's sanctioned inline claims; nothing invented.) Below: three grouped capability lists — **Deployment** / **Data quality** / **Compliance** — with violet top rails and lime-deep ✓ items. This replaced the 2×2 pillar grid cloned from Home.
4. **Endpoints** (dark). H2 "Three endpoints. Everything you need." 3 cards: `GET /v1/bins/{bin}` · `POST /v1/bins/batch` (≤10k) · `GET /v1/dcc/{bin}`. Verb-chip convention: GET cyan, POST lime.
5. **Fits your stack** (white). H2 "Plugs into every decision in your flow." A five-step **payment-flow stepper** — Authorize · Route · Price · Present · Analyze — with mono index nodes on a top rail (vertical rail on mobile); each step carries the matching use case. This replaced the 6-card grid cloned from Home.
6. **Final CTA** (`FinalCta.astro`): "See it on your own BINs." + lead + Book a demo / Talk to sales. **Footer.**

## Page — Features (`features.astro`)
The capability atlas + deployment comparison. (This page has no `.dc.html` prototype — it was re-authored in the 2026-08 pass to replace the interim page adapted from the Pricing prototype.)
1. **Header** (dark, centered). H1 "One engine, every capability." Subhead: everything runs in your environment, on your licenses, same engine either way. Dual CTA (Book a demo / Talk to sales) — the header previously had none. (The mono `// features` eyebrow shipped briefly and was removed with every other eyebrow label.)
2. **Capability atlas** (white). H2 "What the engine does." Five-cell bento (6-col grid, cells span 4/2 then 2/2/2): **Lookup & batch** (wide dark cell, `▸` glyph, mono request lines) · **DCC eligibility** (`€$`) · **Flags & regulation** (`⊞`) · **Confidence & provenance** (`∿`) · **Connectors & seed data** (`⇲`, violet-tinted cell). Glyph chips (`.glyph` in global.css) are the brand-native icon system — no icon font.
3. **Deployment options** (`id="tiers"`, dark). H2 "Three ways to run it." Three horizontal rows (not cards — Home owns the cards): name + mono chip ("self-hosted" / lime "most popular" / "fully managed") + text + ✓ checklist; middle row highlighted violet. CTA "Book a demo".
4. **Comparison table** (off-white). H2 "Compare deployment options." Horizontally scrollable (`min-width:720px`), columns Self-hosted / **Managed in your cloud** (violet) / Fully managed. Real capability rows only (the prototype's three self-referential rows were dropped; "Air-gappable install" added). **SOC 2 renders "Roadmap" in every column** — it is in progress company-wide; no deployment model may show a check.
5. **POC callout** (white). Dashed-violet panel, mono tag "Proof of concept", H2 "Evaluate with a POC in your own cloud.", CTA **Book a demo**.
6. **Volume callout** (dark band). Signature-gradient panel: H2 "Multiple environments, regions, or a managed rollout?" + "Talk to sales" white button.
7. **FAQ accordion** (off-white, max-width 820). H2 "Deployment questions." 8 items, single-open (first open by default), no-JS shows all.
8. **Close** (`FinalCta.astro`). Trust strip (Runs in your cloud · Your data never leaves · Out of PCI scope · DPA available) + H2 "Book a demo today." + Book a demo / Talk to sales. **Footer.**

## ~~Page 5 — Company (`company.astro`)~~ — ⚠ REMOVED. Historical; kept for reference only.
Shipped in the 2026-08 pass and then removed in the same pass — the site carries no company/careers story, and `/company/` now 404s. The careers contact intent went with it. `Company.dc.html` remains a prototype for nothing.

## Page 6 — Contact / Book-a-demo (`contact.astro`) + Slack webhook
The single destination for the primary CTAs, switched by `?intent=`:
- `?intent=demo` (default) — pill "Book a demo", heading "See the engine in your stack."; CTA "Book a demo"; email `demo@findthisbin.com`.
- `?intent=sales` — pill "Talk to sales", heading "Let's talk deployment."; CTA "Request pricing"; email `sales@findthisbin.com`.

Any other value (including legacy `?intent=api-key` and `?intent=careers`) falls through to `demo`.

**Layout** (dark, 2-col `0.85fr 1fr`, stacks ≤940px): left = intent-driven heading/subhead + 3 reassurance check-rows + a "What happens next" card; right = `ContactForm.astro` (gradient glow border).

**Fields:** Full name\*, Work email\*, Company\* (name+email in a 2-col row), Role (optional), **Deployment preference** (`<select>`, field name `volume`): *Not sure yet* (default) / *Self-hosted / BYOC* / *Managed in our cloud* / *Fully managed (BYOL)*, Message (textarea; label/placeholder switch by intent), a honeypot `website` field. Validate: name non-empty, email `^[^@\s]+@[^@\s]+\.[^@\s]+$`, company non-empty. The switch link below the form points at the other journey (demo ↔ sales). Submit = lime, disabled + "Sending…" while submitting.

**Progressive enhancement.** The form natively POSTs to `/api/contact` (303-redirects back with `?sent=1`/`?error=1`, works without JS); a small script intercepts submit, fetches with `Accept: application/json`, and swaps to the success pane inline. Success title "Request received." + intent-specific body + CTAs "Back to home" / "Explore the product". (The cosmetic `ref:` chip was removed in the 2026-08 pass — a fabricated ticket ID read as dishonest.)

**`/api/contact` (`prerender=false`).** Reads `SLACK_WEBHOOK_URL` via `import { env } from "cloudflare:workers"`, validates, honeypot-guards, and posts a Slack Block Kit message. `label = intent==="sales" ? TALK_TO_SALES_LABEL : BOOK_DEMO_LABEL`. Section fields: Name · Work email · Company · Role · **Deployment preference** (`lead.volume`) · Intent, then a Message section. Missing webhook → 500 (logged); Slack non-2xx/throw → 502; honeypot non-empty → fake success, deliver nothing. Set `SLACK_WEBHOOK_URL` via `wrangler secret put` / `.dev.vars` (never in Terraform state).

## CTA wiring (global)
Every CTA routes through the contact form, by intent (centralized in `src/lib/site.ts`):
- **"Book a demo"** (nav button, heroes, deployment-models CTAs, try-it-live, POC callouts/strips, all closers) → **`/contact/?intent=demo`**.
- **"Talk to sales"** (inner-page hero secondary, PSP section, connectors, volume callout, all closers) → **`/contact/?intent=sales`**. ("Request pricing" survives only as the sales-intent submit button label.)
- **"See deployment options"** (Home hero secondary) → **`/#deployment`**; **"See features"** (Home PSP secondary) → **`/features/`**.
- There is **no** "Get your free API key" CTA anywhere, and labels are never improvised per-section — the constants above are the only labels.

---

## Canonical API example (use everywhere code appears)
The displayed host is **`https://bins.internal`** (the `ENGINE_BASE_URL` constant), signalling the engine runs in *your* environment rather than a hosted API.
```
GET https://bins.internal/v1/bins/53847012
```
```json
{
  "bin": "53847012",
  "scheme": "mastercard",
  "type": "credit",
  "category": "consumer",
  "product": "World Elite Mastercard",
  "issuer": { "name": "Revolut Ltd", "country": "GB", "currency": "GBP" },
  "flags": { "prepaid": false, "commercial": false, "regulated_debit": false },
  "dcc_eligible": true,
  "confidence": 0.98,
  "dataset_version": "2026-06-12"
}
```
SDK snippets configure the base URL (`baseUrl` / `base_url` / `WithBaseURL`) to the same host, reinforcing self-hosting.

---

## Interactions & Behavior (near-zero client JS)
Each interaction is a small scoped inline `<script>` (vanilla TS); the rest ships as static HTML. Respect `prefers-reduced-motion`; JS-gated content has no-JS fallbacks.

### Nav scroll + mobile menu
Passive scroll listener toggles `scrolled` at `scrollY > 12`; hamburger toggles `open` on mobile.

### BIN playground (Home "Try it live") — `src/lib/bin.ts`
- Numeric input (first 8 digits) + quick-pick chips: `53847012`, `45717360`, `37828224`, `40128210`. SSR-renders the `53847012` card by default; the client island re-renders on input.
- Exact `SAMPLES` match → that record (`bestGuess:false`); otherwise a deterministic synthesis from the digit-sum:

  | bin | scheme | type | category | product | issuer | country | currency | prepaid | commercial | regulated_debit | dcc | confidence |
  |---|---|---|---|---|---|---|---|---|---|---|---|---|
  | 53847012 | Mastercard | Credit | Consumer | World Elite Mastercard | Revolut Ltd | GB | GBP | false | false | false | true | 0.98 |
  | 45717360 | Visa | Debit | Consumer | Visa Classic Debit | BNP Paribas | FR | EUR | false | false | true | true | 0.97 |
  | 37828224 | Amex | Charge | Commercial | Business Platinum Card | American Express | US | USD | false | true | false | false | 0.95 |
  | 40128210 | Visa | Prepaid | Consumer | Visa Prepaid Reloadable | Wise Payments | BE | EUR | true | false | false | true | 0.93 |

  Synthesis (deterministic): scheme by first digit (4=Visa, 2/5=Mastercard, 3=Amex, 6=Discover, else Unknown); `sum` = digit sum; `type = ['Credit','Debit','Prepaid','Charge'][sum%4]`; country `['DE','FR','ES','NL','IT','US','GB','PL','IE','SE'][sum%10]` (matching currency); issuer `['Deutsche Bank','Santander','ING Group','UniCredit','Barclays','Citi','Nordea','Raiffeisen'][sum%8]`; `commercial = sum%5===0`; `regulated_debit = type==='Debit' && sum%2===0`; `dcc = scheme!=='Amex'`; `confidence = 0.84 + (sum%9)/100`; `bestGuess:true`.
- Result card: Scheme, Type, Issuer (+ product), Country, Currency, DCC, Flags (lime ✓ / muted ✕), and a Confidence bar (gradient fill) with a hint: "Exact 8-digit range match" vs "Best-guess match · lower confidence" + "Dataset version 2026-06-12".

### Code language tabs (Home "How it works"; Product "Anatomy") — `CodeTabs.astro`
Active-tab swaps the visible Shiki-highlighted block (build-time, no client highlighting). Active tab = lime text/border on a faint lime bg. Optional `footer` renders the mono status line (`→ 200 OK · scheme: "mastercard" · confidence: 0.98`).

### Features FAQ
Single-open accordion, item 0 open by default; `+`↔`–`. No-JS shows all answers. **There is no pricing toggle** (per-lookup/annual pricing was removed).

## Responsive & accessibility
Mobile-first; key breakpoints **860px** (nav, atlas bento), **980px** (hero, spec tiles), **900px** (2-col + footer + deployment cards), **820px** (pillars, spec groups, deployment rows). Fluid `clamp()` type/spacing. Comparison table scrolls horizontally under ~720px. Maintain WCAG AA contrast on dark sections; semantic landmarks; keyboard-operable accordions/tabs (real `<button>`s, `aria-expanded`); visible focus states.

## Assets
- **Fonts:** Space Grotesk, IBM Plex Sans, IBM Plex Mono — self-hosted via the Astro Fonts API.
- **Icons:** inline SVGs only (nav toggle bars). Feature/endpoint "icons" are **mono glyph chips** (`.glyph`), not an icon font.
- **Logos:** FindThisBIN is a text wordmark. **No partner/customer logos.** Card-scheme names are plain text / generic motifs — never trademarked logo files.
- **No raster images** — all visuals are CSS gradients, glows, and type.
