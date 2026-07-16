# FindThisBIN Marketing Site — Design Spec (v3, enterprise infrastructure)

> ## ⚠ Read this before trusting a page section
>
> **This file is authoritative for tokens, the type scale, copy rules, CTA
> wiring, and the BIN-playground logic. Its per-page sections are STALE.**
>
> The v3 repositioning changed the page structure and this spec was never
> updated, so the two disagree — and MARKETING_TECH_STACK.md §14 declares this
> file authoritative, which means the stale half gets believed. Concretely:
>
> | This spec says | Reality |
> |---|---|
> | Page 2 — Pricing (`pricing.astro`) | **Does not exist.** Never built. |
> | Page 3 — Docs (`docs.astro`) | **Does not exist.** Never built. |
> | *(not mentioned)* | **`features.astro` ships** and has no spec here. |
> | *(not mentioned)* | **`privacy` / `terms` / `dpa` / `gdpr` ship.** |
> | *(not mentioned)* | **`404.astro` ships** (branded not-found). |
> | Nav has an `active` prop | Nav self-derives from `Astro.url.pathname`. |
> | Nav links: Product / Pricing / Docs / Company | Product / Features / Company. |
>
> **The real page list is in `CLAUDE.md` and `README.md`, and `npm run conform`
> checks it against the filesystem.** Those are trustworthy; the sections below
> are not, until someone re-authors them.
>
> Writing the Features spec is design work, not a mechanical edit — it needs a
> human who knows what that page is for. It is deliberately left undone rather
> than invented here, because a fabricated spec would be worse than an absent
> one. Delete this banner when the page sections match `src/pages/`.


> **Positioning (v3).** FindThisBIN is a **deployable BIN intelligence engine** that payment platforms (PSPs) run in their **own cloud** — self-hosted / BYOC, managed-in-your-cloud, or fully-managed (BYOL). Customers **bring their own data licenses** (Visa VBASS, Mastercard BIN table, commercial feeds, CSV); we provide the engine, the 8-digit logic, the multi-source merge, the sub-10ms hot path, and the ops. This is **not** a self-serve hosted API — there is no signup, no API-key flow, and no per-lookup pricing. The bold fintech identity (palette, typography, gradient/glow motif, code panels, motion, font stack) is **unchanged** from the original brief; what changed is messaging, page structure, and CTAs. This document is the authoritative spec; the refreshed `design_files/*.dc.html` prototypes are the visual reference, and `design_files/findthisbin-design-addendum.md` records the repositioning deltas.

## Overview
A bold, modern, **multi-page marketing site** for **FindThisBIN** (findthisbin.com) aimed at **infrastructure buyers** — both the platform decision-maker (compliance, data residency, build-vs-buy, time-to-value) and their engineers (clean API, deploy in your stack).

**The pages that actually ship** (see the banner above — the numbered specs
further down still describe the pre-repositioning set):

1. **Home / landing** (`/`)
2. **Product** (`/product/`) — product/feature deep-dive
3. **Features** (`/features/`) — *ships; no spec in this file yet*
4. **Company** (`/company/`) — about + careers (`#careers`)
5. **Contact / Book-a-demo** (`/contact/`) — the form behind both primary CTAs; posts a Slack message via webhook (`/api/contact/`)
6. **Legal** — `/privacy/`, `/terms/`, `/dpa/`, `/gdpr/`
7. **404** — branded not-found

There is no Pricing page and no Docs page. `design_files/Pricing.dc.html` and
`Docs.dc.html` are prototypes for pages that were never built.

**Messaging priority (new order):** (1) deploy in your cloud / we handle the ops, (2) compliance & data residency (your data never leaves; out of PCI scope and the card/data path), (3) build-vs-buy / time-to-value, (4) correctness & performance (8-digit, multi-source, sub-10ms), with developer experience reframed as "your team integrates a clean API." Fraud stays a minor supporting use case.

**Honesty constraints (do not violate).** No fabricated social proof: **no partner/customer wordmarks** and **no invented scale metrics** (e.g. "6.2M BINs", "242 countries", "184M lookups/day"). The prototypes reintroduce these as illustrative placeholders — they are intentionally **not shipped** (no social-proof strip, no animated counters, no fabricated stat bands on Home / Product / Company). Only defensible, repeatable claims appear inline: `sub-10ms p99`, `99.9% uptime`, `8-digit` precision, EU residency. SOC 2 is "in progress / roadmap" (never "certified"); GDPR-clean + DPA available; PCI **out of scope** (no PCI DSS certification claim). Card-scheme names render as plain text / generic motifs — never trademarked logos.

## Stack & build
Built as a static, prerendered **Astro 6** site (`output: "static"`) on the `@astrojs/cloudflare` adapter, Tailwind v4 (config-in-CSS), self-hosted fonts via the Astro Fonts API. Every page prerenders except the on-demand `/contact/` (reads query params) and **`/api/contact/`** (`prerender = false`, the Slack-webhook endpoint) — two on-demand routes. `trailingSlash: "always"`; every path carries the slash. See `README.md` / `CLAUDE.md` for commands, the two-wrangler-config setup, and the deploy runbook (`DEPLOYMENT.md`).

**Routing & anchors:** `Home`→`/`, `Product`→`/product`, `Pricing`→`/pricing`, `Docs`→`/docs`, `Company`→`/company`, `Contact`→`/contact` (+ `/api/contact`). In-page anchors preserved as section `id`s: `#deployment` (new — Home deployment models), `#try`, `#psp` (Home), `#tiers` (Pricing), `#reference`, `#sdks` (Docs), `#careers` (Company), `#footer`.

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
| `--violet` | `#7C5CFF` | Primary accent (eyebrows, links, accents) |
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
| `--text-dark-faint` | `#5C5C6E` | Eyebrow/uppercase labels on dark |
| `--border-dark` | `rgba(255,255,255,0.08)` | Borders on dark surfaces |
| `--check-green` | `#1FA463` | Table checkmarks; status dot |

**Signature gradient** (CTA fills, volume callout, confidence bar):
`linear-gradient(115deg, #7C5CFF, #6366F1 45%, #3B82F6)` — animated via `background-size:200% 200%` + `ftbGrad` keyframe (14s ease infinite).

**Glow blobs:** `radial-gradient(circle, rgba(124,92,255,0.45), transparent 70%)` with `filter:blur(14–30px)`, absolutely positioned behind hero/CTA sections.

### Typography
Self-hosted via the Astro Fonts API (`fontProviders.google()` in `astro.config.mjs`), **not** `<link>` to Google Fonts. Families exposed as CSS vars: `--ff-display` (**Space Grotesk**, 500/600/700, headings), `--ff-body` (**IBM Plex Sans**, 400/500/600/700, body/UI), `--ff-mono` (**IBM Plex Mono**, 400/500, code/eyebrows).

| Role | Family | Weight | Size | Tracking | Line-height |
|---|---|---|---|---|---|
| Hero H1 | Space Grotesk | 700 | `clamp(40px,6vw,72px)` | `-0.03em` | 1.02 |
| Page H1 (Pricing/Docs/Company) | Space Grotesk | 700 | `clamp(36px,5.5vw,64px)` | `-0.03em` | 1.03 |
| Section H2 | Space Grotesk | 700 | `clamp(30px,4.2vw,48px)` | `-0.025em` | 1.05 |
| Card title H3 | Space Grotesk | 700 | 26px | `-0.02em` | 1.1 |
| Eyebrow label | IBM Plex Sans (or IBM Plex Mono on Docs) | 700 | 13px | `0.08em` | uppercase |
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
- Left: wordmark **FindThis**(white)**BIN**(cyan). Center links: Product / Features / Company. The active link is **self-derived** from `Astro.url.pathname` (normalized on both sides) and marked with `aria-current="page"` — there is no `active` prop; pages pass nothing.
- Right: primary **"Book a demo"** button → `/contact/?intent=demo` (lime fill, glow). *(There is no "Sign in" link in the shipped nav.)*
- **Mobile (≤860px):** hamburger toggles a full-width panel with stacked links. *(inline script)*

### Footer (`SiteFooter.astro`)
- Background `#08080E`, 5-col grid (`1.6fr 1fr 1fr 1fr 1fr` → `1fr 1fr` ≤900px), `id="footer"`.
- Col 1: wordmark, tagline **"The BIN intelligence engine for payment platforms. Deploy it in your own cloud; your data never leaves."**, and a cyan **"Runs in your cloud · EU option"** pill.
- Columns: **Product** · **Developers** · **Company** · **Legal** (Privacy, Terms, DPA, GDPR). ⚠ *This list references Pricing / Docs / SDKs / Blog / Status — verify against `SiteFooter.astro` before trusting it; the pages behind several of those do not exist.*
- Bottom bar: "© 2026 FindThisBIN…" + GitHub / X / LinkedIn icon links.

---

## Page 1 — Home (`index.astro`)
Sections, in order (alternating dark / light; social-proof + stat-band sections intentionally omitted):

1. **Hero** (dark). Eyebrow pill ("BIN intelligence engine · Runs in your cloud", lime dot). H1 **"The BIN intelligence engine payment platforms run themselves."** — "run themselves." gradient-clipped. Subhead: the deploy-in-your-cloud / BYOL paragraph. Dual CTA: **Book a demo** (lime) + **See deployment options** (ghost → `#deployment`). Trust strip (cyan `●`): **Runs in your cloud · Your data never leaves · Out of PCI scope · EU-hosted option · sub-10ms p99**. Right column is the **deployment-motif demo panel** (`DemoPanel.astro`):
   - Window chrome `findthisbin-engine · your-cloud`; a dashed "your cloud" box headed `your cloud · eu-west-1 · vpc` / `data stays here`.
   - Deployment flow: licensed sources (`VBASS` · `Mastercard` · `CSV`) → engine (`FindThisBIN engine` / "8-digit · multi-source merge") → output (`your API`, lime).
   - Request line: lime `GET` badge + `https://bins.internal/v1/bins/53847012` (BIN in cyan).
   - Canonical JSON body, each line `ftbUp` staggered (0.05s → 0.72s) + blinking lime caret.
   - Scheme strip: "Coverage across every major scheme" + VISA / Mastercard / AMEX / Discover / JCB / UnionPay as **plain greyscale text**.
2. **Value pillars** (`id="product"`, white). H2 "Engineered for the teams that move money." 2×2 grid, new order:
   - **01 · Deploy in your cloud** (dark, lime eyebrow) "Run it where your data lives." + `helm install` mini-snippet.
   - **02 · Compliance & data residency** (light) "Your data never leaves." + chips: Out of PCI scope, Data stays in your VPC, Per-customer DPA, EU-hosting option.
   - **03 · Build vs. buy** (light) "Live this week, not in two quarters." + big "days" stat.
   - **04 · Correctness & performance** (dark, cyan eyebrow) "Correct data, on the hot path." + stats `<10ms` p99 · `8-digit`.
3. **Deployment models** (`id="deployment"`, dark). Eyebrow "Deployment models" (lime). H2 "One engine. You choose who runs it." 3 cards — **Self-hosted / BYOC** · **Managed in your cloud** *(highlighted, lime "most popular" chip + violet border)* · **Fully managed (BYOL)** — each with a checklist (lime ✓ on cards 1 & 3, cyan ✓ on the highlighted card). Section CTA "Book a demo".
4. **Bring your own licenses / connectors** (white). Eyebrow "Bring your own licenses". H2 "Plug in your licenses. We did the hard logic." Body + provider-brokerage line. CTA "Talk to sales about connectors" → sales. Connector list: VBASS · Mastercard BIN table · Commercial providers · CSV upload · **Bundled open seed data** (highlighted, lime badge, "works on day one").
5. **Try it live** (`id="try"`, dark). Eyebrow "Playground" (cyan). H2 "Look up any BIN, right now." Interactive `BinPlayground.astro` (see logic below). CTA "See it on your own BINs — book a demo" → demo.
6. **What you get** (off-white). H2 "Every field your stack needs." Grid of 13 field chips (`dcc_eligible` & `confidence` highlighted violet).
7. **Build vs. buy** (white). Eyebrow "Build vs. buy". H2 "Months of specialist work, or a deployment this week." Two columns — **Build it in-house** (✕, muted) vs **Deploy the engine** (✓, lime, dark card), 5 items each.
8. **For payment platforms** (`id="psp"`, dark, violet glow). Eyebrow "For payment platforms" (cyan). H2 "Embed card intelligence across your entire stack." 2-col: copy + CTAs (Talk to sales / See platform pricing → `/pricing`) | 4 mini-cards (Smarter routing, Surcharging & interchange, DCC eligibility for EU flows, Richer checkout UX & risk).
9. **Use cases** (white). H2 "One dataset, six revenue levers." 6 cards, violet border on hover.
10. **How it works** (dark). Eyebrow "How it works" (lime). H2 "Three steps to production." 2-col: 3 numbered steps (**Deploy in your cloud → Connect your licenses → Integrate the API**) | code panel with language tabs (cURL / Node / Python / Go / PHP), all targeting `https://bins.internal`.
11. **Pricing preview** (off-white). H2 "Pricing that fits your deployment." 3 cards (Startup / **Growth** highlighted dark "MOST POPULAR" / Enterprise), prices "Let's talk" / "Custom", CTAs Request pricing / Talk to sales → `/contact?intent=sales`. Link "Compare all plans & features →" → `/pricing`.
12. **Compliance & residency callout** (white). Rounded panel, 4 items: Your environment · Out of the data path · Out of PCI scope · DPA & EU option (each violet title + one line).
13. **Dev/docs CTA** (dark, faint grid background). H2 "Everything you need to integrate in minutes." 2-col: copy + CTAs (Read the docs / API reference) | 2×2 link cards (Docs, API Reference, SDKs, Postman), cyan border on hover.
14. **Final CTA** (gradient + violet glow). H2 **"Run BIN intelligence in your own cloud."** + Book a demo / Talk to sales.
15. **Footer.**

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
1. **Hero** (dark, centered). Eyebrow "Product". H1 "The card-intelligence layer for **payment platforms.**" Subhead opens on deploy-in-your-cloud / BYOL. Dual CTA (Book a demo / Talk to sales).
2. **Anatomy of a lookup** (white). 2-col: copy ("the engine running in your environment") + 4 grouped bullets (Identity / Issuer / Flags & DCC / Provenance) | dark code panel (`findthisbin-engine · your-cloud`, `GET https://bins.internal/v1/bins/53847012`) + canonical JSON.
3. **Capabilities** (off-white). H2 "Four things we obsess over." 2×2 pillars — **01 Deploy in your cloud** ("Run it where your data lives.") / 02 EU & compliance / 03 Accuracy / 04 Performance.
4. **Endpoints** (dark). H2 "Three endpoints. Everything you need." 3 cards: `GET /v1/bins/{bin}` · `POST /v1/bins/batch` (≤10k) · `GET /v1/dcc/{bin}`. Link → `/docs#reference`.
5. **Fits your stack** (white). H2 "Plugs into every decision in your flow." 6 cards.
6. **Final CTA** (gradient): "See it on your own BINs." + Book a demo / Talk to sales. **Footer.**

## Page 5 — Company (`company.astro`)
1. **Hero** (dark). Eyebrow "Company". H1 "Building the trust layer for **payments.**" + mission subhead.
2. **Mission / story** (white). 2-col: H2 "BIN data was stuck in the 6-digit era. Payments moved on." | 3 paragraphs (the middle one references "a sub-10ms engine you run in your own cloud").
3. **Principles** (off-white). H2 "Principles we build on." 4 numbered cards: Precision over guesswork · Developer-first (no "free tier" claim) · **Runs in your environment** · Out of PCI scope.
4. **Careers** (`id="careers"`, dark). Eyebrow "Careers". H2 "Come build payments infrastructure." + 3 roles (Senior Data Engineer — BIN Pipeline · Backend Engineer — Low-latency API · Developer Advocate — Payments), each "Remote (EU) · Full-time" + "View role →". CTA "Get in touch" → sales. (Footer Careers link targets `#careers`.)
5. **Final CTA** (gradient): "Build on card intelligence you can trust." + Book a demo / Talk to sales. **Footer.**

## Page 6 — Contact / Book-a-demo (`contact.astro`) + Slack webhook
The single destination for **both** primary CTAs, switched by `?intent=`:
- `?intent=demo` (default) — eyebrow "Book a demo", heading "See the engine in your stack."; CTA "Book a demo"; email `demo@findthisbin.com`.
- `?intent=sales` — eyebrow "Talk to sales", heading "Let's talk deployment."; CTA "Request pricing"; email `sales@findthisbin.com`.

Any non-`sales` intent (including legacy `?intent=api-key`) falls through to `demo`.

**Layout** (dark, 2-col `0.85fr 1fr`, stacks ≤940px): left = intent-driven heading/subhead + 3 reassurance check-rows (**Deployed in your cloud in days, not months** · **Your data never leaves your environment** · **Out of PCI scope · DPA · EU-hosting option**) + a "What happens next" card with a contact-email link; right = `ContactForm.astro` (gradient glow border).

**Fields:** Full name\*, Work email\*, Company\* (name+email in a 2-col row), Role (shown for both intents, optional), **Deployment preference** (`<select>`, field name `volume`): *Not sure yet* (default) / *Self-hosted / BYOC* / *Managed in our cloud* / *Fully managed (BYOL)*, Message (textarea; label/placeholder switch by intent), a honeypot `website` field. Validate: name non-empty, email `^[^@\s]+@[^@\s]+\.[^@\s]+$`, company non-empty. The switch link below the form toggles to the **other** intent. Submit = lime, disabled + "Sending…" while submitting.

**Progressive enhancement.** The form natively POSTs to `/api/contact` (303-redirects back with `?sent=1`/`?error=1`, works without JS); a small script intercepts submit, fetches with `Accept: application/json`, and swaps to the success pane inline. Success title "Request received." + intent-specific body + a cosmetic `ref:` chip.

**`/api/contact` (`prerender=false`).** Reads `SLACK_WEBHOOK_URL` via `import { env } from "cloudflare:workers"`, validates, honeypot-guards, and posts a Slack Block Kit message. `label = intent === "sales" ? "Talk to sales" : "Book a demo"`. Section fields: Name · Work email · Company · Role · **Deployment preference** (`lead.volume`) · Intent, then a Message section. Missing webhook → 500 (logged); Slack non-2xx/throw → 502; honeypot non-empty → fake success, deliver nothing. Set `SLACK_WEBHOOK_URL` via `wrangler secret put` / `.dev.vars` (never in Terraform state).

## CTA wiring (global)
Every primary CTA routes through the contact form, by intent (centralized in `src/lib/site.ts`):
- **"Book a demo"** (nav button, hero, deployment-models CTA, try-it-live, docs quickstart "Start here", docs utility bar, POC callout, all closers) → **`/contact?intent=demo`**.
- **"Talk to sales"** / **"Request pricing"** (hero secondary on inner pages, PSP, connectors, all pricing tier CTAs, volume callout, company "Get in touch", all closers) → **`/contact?intent=sales`**.
- **"See deployment options"** (Home hero secondary) → **`/#deployment`**.
- **"Sign in"** (nav only) stays a placeholder. There is **no** "Get your free API key" CTA anywhere.

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

### Code language tabs (Home "How it works"; Docs quickstart) — `CodeTabs.astro`
Active-tab swaps the visible Shiki-highlighted block (build-time, no client highlighting). Active tab = lime text/border on a faint lime bg.

### Pricing FAQ
Single-open accordion, item 0 open by default; `+`↔`–`. No-JS shows all answers. **There is no pricing toggle** (per-lookup/annual pricing was removed).

## Responsive & accessibility
Mobile-first; key breakpoints **860px** (nav), **980px** (hero), **900px** (2-col + footer + deployment cards + docs), **820px** (pillars), **920px** (pricing tiers stack). Fluid `clamp()` type/spacing. Comparison table scrolls horizontally under ~720px. Maintain WCAG AA contrast on dark sections; semantic landmarks; keyboard-operable accordions/tabs (real `<button>`s, `aria-expanded`); visible focus states.

## Assets
- **Fonts:** Space Grotesk, IBM Plex Sans, IBM Plex Mono — self-hosted via the Astro Fonts API.
- **Icons:** inline SVGs only (search magnifier, footer GitHub/X/LinkedIn).
- **Logos:** FindThisBIN is a text wordmark. **No partner/customer logos.** Card-scheme names are plain text / generic motifs — never trademarked logo files.
- **No raster images** — all visuals are CSS gradients, glows, and type.
