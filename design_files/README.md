# Handoff: FindThisBIN Marketing Site → Static Astro Build

> ## ⚠ READ FIRST — v3 Repositioning (Enterprise infrastructure)
> The product **pivoted** from a self-serve developer BIN **API** to a **deployable BIN intelligence engine** that PSPs run in their **own cloud** (self-hosted / managed-in-your-cloud / fully-managed BYOL), plugging in **their own data licenses** (Visa VBASS, Mastercard, commercial, CSV). The bold fintech identity, palette, typography, code panels, motion, and the font stack are **unchanged**. What changed is messaging, structure, and CTAs. **The refreshed `design_files/*.dc.html` are the source of truth** — where any older prose in this README conflicts with them, the files win. Key deltas:
>
> - **CTAs:** primary action is **“Book a demo”** (→ `/contact?intent=demo`); secondary **“See deployment options”** (Home `#deployment`) or **“Talk to sales”** (→ `/contact?intent=sales`). **All self-serve “Get your free API key” / “Start free” / per-lookup pricing is removed.** “Sign in” stays low-key in the nav.
> - **Contact page** (`/contact`): now **Book-a-demo / Talk-to-sales** (intents `demo` default + `sales`), not API-key signup. Fields: name, work email, company, role, **Deployment preference** (`Not sure yet` / `Self-hosted / BYOC` / `Managed in our cloud` / `Fully managed (BYOL)`), message. Slack payload label is “Book a demo” / “Talk to sales”; the `*Deployment preference:*` field replaces the old monthly-lookups field. The `/api/contact` → Slack-webhook wiring (documented later) is unchanged.
> - **Home** new section order: Hero (deployment headline + a *deployment motif* in the demo panel: licensed sources → engine → your API, inside `your cloud · eu-west-1 · vpc`) → Social proof → **Value pillars reordered** (01 Deploy in your cloud · 02 Compliance & data residency · 03 Build vs. buy · 04 Correctness & performance) → **Deployment models** (`#deployment`, 3 cards: Self-hosted/BYOC · Managed in your cloud *(highlighted)* · Fully managed BYOL) → **Bring your own licenses / connectors** (VBASS · Mastercard · commercial · CSV · bundled seed data) → Try-it-live (now framed as engine output, with a Book-a-demo CTA) → What you get → **Build vs. buy** (two columns: build in-house ✕ vs deploy the engine ✓) → PSP → Use cases → **How it works** reframed to **Deploy → Connect → Integrate** → Performance band → Compliance & residency → **Pricing preview reframed to enterprise tiers** (Startup / Growth / Enterprise, contact-driven) → Dev/docs CTA → Final CTA (“Run BIN intelligence in your own cloud.”). Trust strip is now “Runs in your cloud · Your data never leaves · Out of PCI scope · EU-hosted option · sub-10ms p99”. Hosted URLs shown as `https://bins.internal/...` to signal self-hosting.
> - **Pricing** (`/pricing`): **monthly/annual toggle and per-lookup prices removed.** Three contact-driven tiers — **Startup** (single deployment, base connectors, community support), **Growth** *(highlighted; HA, more connectors, 99.9% SLA, standard support)*, **Enterprise** (multi-environment + fully-managed, premium connectors, custom SLAs, dedicated support). Prices show “Let’s talk” / “Custom”; every CTA is **Request pricing / Talk to sales**. A **POC callout** (“Evaluate with a POC in your own cloud”) replaces the free-tier messaging. The comparison table swaps per-lookup rows for **infrastructure rows** (deployment modes, included connectors, bundled seed data, DCC, surcharging, network-token indicators, data-stays-in-your-env, uptime SLA, managed ops, support level, dataset export, DPA, SOC 2). FAQ reframed to deployment/data-residency/licensing/POC/air-gapped questions (full copy in `Pricing.dc.html`).
> - **Docs** (`/docs`): quickstart is now **“Deploy in your cloud in 15 minutes”** (Deploy the engine → Connect a data source → Make your first lookup). Doc grid adds **Deployment · Connecting data sources · License configuration · Tenant setup · Upgrades & operations · Observability** alongside the existing API topics. Persistent CTA is **Book a demo**. SDKs & API reference stay, framed as “integrate the engine you’ve deployed”.
> - **Product / Company:** hero + pillar copy nudged to the deploy-in-your-cloud story (Product pillar 01 → “Deploy in your cloud”; Company principle 03 → “Runs in your environment”). Footer tagline → “The BIN intelligence engine… deploy it in your own cloud; your data never leaves”; footer badge → “Runs in your cloud · EU option”.
>
> Everything below this banner is the original v2 spec; treat it as background and defer to the refreshed design files for current copy and structure.

## Overview
A bold, modern, conversion-focused **multi-page marketing site** for **FindThisBIN** (findthisbin.com) — a developer-first BIN (Bank Identification Number) intelligence API for payment platforms. Three pages share one identity, navigation, and footer:

1. **Home / landing** (`Home.dc.html`)
2. **Pricing** (`Pricing.dc.html`)
3. **Docs landing** (`Docs.dc.html`)

Plus three supporting pages that share the same nav, footer, and identity:

4. **Product** (`Product.dc.html`) — product/feature deep-dive
5. **Company** (`Company.dc.html`) — about + careers (`#careers`)
6. **Contact / Book-a-demo** (`Contact.dc.html`) — the form behind both primary CTAs; submits a Slack message via webhook (see its section below)

The audience is PSPs/payment platforms whose engineers run the technical evaluation. Message priority: (1) developer experience & speed, (2) EU residency & compliance, (3) data accuracy & coverage, (4) fraud-prevention signals.

## Target: Static Astro site
**Build this as a static, server-rendered Astro site** (`output: 'static'` — the default). Recommended structure:

```
src/
  layouts/BaseLayout.astro      ← <html>, <head> (fonts, meta), global CSS, <Nav/> + <slot/> + <Footer/>
  components/
    Nav.astro                   ← sticky nav, `active` prop ("home"|"product"|"pricing"|"docs"|"company")
    Footer.astro
    CodeBlock.astro             ← reusable syntax-highlighted code panel
    PricingCard.astro
    BinPlayground.astro         ← interactive island (see "Islands" below)
    ContactForm.astro           ← interactive island: book-a-demo / get-API-key form
  pages/
    index.astro                 ← Home
    product.astro
    pricing.astro
    docs.astro
    company.astro
    contact.astro               ← reads ?intent=api-key|sales
    api/contact.ts              ← SSR endpoint → Slack webhook (prerender=false)
  styles/tokens.css             ← CSS custom properties (the design tokens below)
```

**Routing:** the design files cross-link as `*.dc.html`; in Astro these become routes — `Home`→`/`, `Product`→`/product`, `Pricing`→`/pricing`, `Docs`→`/docs`, `Company`→`/company`, `Contact`→`/contact`. Replace every `*.dc.html` href accordingly (e.g. `Contact.dc.html?intent=sales` → `/contact?intent=sales`). Preserve in-page anchors as section `id`s: `#try`, `#psp`, `#tiers`, `#reference`, `#sdks`, `#careers` (Company), `#footer`. Note `#product` / `#company` are now **real pages** (`/product`, `/company`), not Home anchors.

**Interactivity → Astro Islands.** Most of the site is static markup. Only a few things need client JS. Implement each as a framework island (React/Preact/Svelte/Vue — your choice; `client:visible` or `client:load`) or a small inline `<script>`:
- Nav scroll-translucency + mobile menu toggle
- Hero JSON staggered reveal animation (pure CSS — see below; no JS needed)
- Stat counters that animate up on mount
- Live BIN playground (Home)
- Code-language tab switcher (Home "How it works", Docs quickstart)
- Pricing monthly/annual toggle + FAQ accordion
- Contact form: field validation, intent switch, submit → POST `/api/contact` (Slack)

Keep islands small and scoped; the rest of every page should ship as zero-JS static HTML.

## About the Design Files
The files in `design_files/` are **design references created in HTML** — prototypes showing the intended look and behavior, **not production code to copy verbatim**. They are authored in a streaming "Design Component" format (`*.dc.html` + `support.js` runtime) and use **inline-style objects** (camelCased React-style: `fontFamily`, `borderTop`, etc.) instead of CSS files. Do **not** port the inline styles or the `.dc.html`/`support.js` runtime into Astro.

Your task: **recreate these designs in idiomatic Astro** — extract the values below into a real CSS token sheet (`:root { --* }`) + component-scoped `<style>` blocks (or Tailwind, if you prefer; tokens map cleanly to a Tailwind theme), and rebuild each section as clean semantic Astro markup. Use the screenshots/this README as the source of truth for exact values.

To preview a reference file locally, open the `.dc.html` in a browser (it self-bootstraps via `support.js`). Treat rendering quirks as artifacts of the prototype runtime, not design intent.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, copy, and interactions are all specified. Recreate pixel-faithfully using the tokens and per-section specs below. Where the prototype used `clamp()` for fluid type/spacing, keep the `clamp()` (values given).

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
| `--check-green` | `#1FA463` / `#1FA463` | Table checkmarks |
| `--status-green` | `#1FA463` | Status dot |

**Signature gradient** (hero CTAs, performance band, confidence bar):
`linear-gradient(115deg, #7C5CFF, #6366F1 45%, #3B82F6)` — animated via `background-size:200% 200%` + `ftbGrad` keyframe (14s ease infinite).

**Glow blobs:** `radial-gradient(circle, rgba(124,92,255,0.45), transparent 70%)` with `filter:blur(14–30px)`, absolutely positioned behind hero/CTA sections.

### Typography
Load via Astro's font system (the project's exact config below), or Google Fonts otherwise:

```js
// astro.config.mjs — import { fontProviders } from 'astro/config'; experimental: { fonts: [...] }
fonts: [
  { provider: fontProviders.google(), name: "Space Grotesk", cssVariable: "--ff-display", weights: [500,600,700], subsets: ["latin"], fallbacks: ["system-ui","sans-serif"] },
  { provider: fontProviders.google(), name: "IBM Plex Sans",  cssVariable: "--ff-body",    weights: [400,500],     subsets: ["latin"], fallbacks: ["system-ui","sans-serif"] },
  { provider: fontProviders.google(), name: "IBM Plex Mono",  cssVariable: "--ff-mono",    weights: [500],         subsets: ["latin"], fallbacks: ["ui-monospace","monospace"] },
],
```

Map to CSS vars: `--ff-display` (Space Grotesk, headings), `--ff-body` (IBM Plex Sans, body/UI), `--ff-mono` (IBM Plex Mono, code). **⚠ Weight note:** the design uses IBM Plex Sans **600 & 700** for buttons, eyebrows, footer headers and labels, and IBM Plex Mono **400** in some code — the provided `weights` arrays omit these, so either add `600,700` to IBM Plex Sans and `400` to IBM Plex Mono, or those weights will synthesize (faux-bold). Quick reference:
```
Space Grotesk: 500,600,700   (display / headings)
IBM Plex Sans: 400,500 (+600,700 used)        (body / UI)
IBM Plex Mono: 400,500   (code, eyebrows, mono tokens)
```
| Role | Family | Weight | Size | Tracking | Line-height |
|---|---|---|---|---|---|
| Hero H1 | Space Grotesk | 700 | `clamp(40px,6vw,72px)` | `-0.03em` | 1.02 |
| Page H1 (Pricing/Docs) | Space Grotesk | 700 | `clamp(36px,5.5vw,64px)` | `-0.03em` | 1.03 |
| Section H2 | Space Grotesk | 700 | `clamp(30px,4.2vw,48px)` | `-0.025em` | 1.05 |
| Card title H3 | Space Grotesk | 700 | 26px | `-0.02em` | 1.1 |
| Eyebrow label | IBM Plex Sans (or IBM Plex Mono on Docs) | 700 | 13px | `0.08em` | uppercase |
| Body | IBM Plex Sans | 400 | `clamp(16px,1.7vw,19px)` | normal | 1.6 |
| Small / meta | IBM Plex Sans | 500 | 13–14px | normal | 1.5 |
| Code | IBM Plex Mono | 400–500 | 12.5–13px | normal | 1.7–1.8 |
| Big stat | Space Grotesk | 700 | `clamp(34px,5vw,56px)` | `-0.03em` | 1 |

### Spacing & shape
- Section vertical padding: `clamp(56px,7vw,96px)` to `clamp(64px,8vw,112px)`.
- Content max-width: `1240px` (marketing), `1100px` (Docs body), `820–920px` (centered headers/FAQ). Side padding `24px`.
- Border radius: pills `999px`; buttons `10–12px`; cards `14–18px`; large callouts `20px`; code panels `16px`; inner code lines `9px`.
- Card gaps: `14–24px`.
- Shadows: button glow `0 12px 36px -10px rgba(196,245,66,0.6)`; popular pricing card `0 30px 70px -28px rgba(124,92,255,0.7)`; demo panel `0 30px 80px -30px rgba(0,0,0,0.8)`.

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

### Nav (`Nav.astro`, prop `active`)
- Sticky, `top:0`, `z-index:1000`, `height:68px`, `backdrop-filter:blur(14px)`.
- Background **changes on scroll**: `rgba(11,11,18,0.32)` at top → `rgba(11,11,18,0.85)` once `window.scrollY > 12`, with a bottom border fading in (`rgba(255,255,255,0.08)`). 0.3s transition. *(island / inline script)*
- Left: wordmark **FindThis**(white)**BIN**(cyan `#22D3EE`), Space Grotesk 700, 21px, `-0.02em`. Links to `/`.
- Center links: Product (`/product`), Pricing (`/pricing`), Docs (`/docs`), Company (`/company`). Inactive `#9A9AAE`, active `#FFFFFF`, hover `#FFFFFF`. Active link determined by `active` prop.
- Right: "Sign in" (text, `#C7C7D6`, placeholder `#`) + **"Get your free API key"** button → `/contact?intent=api-key` — lime `#C4F542` fill, `#0B0B12` text, `radius:10px`, glow shadow, `translateY(-1px)` on hover.
- **Mobile (≤860px):** hide center links + Sign in, show hamburger button (40×40, `radius:10px`, translucent border). Toggling opens a full-width panel (`rgba(11,11,18,0.97)`) with stacked links. *(island)*

### Footer (`Footer.astro`)
- Background `#08080E`, top border `rgba(255,255,255,0.07)`, `padding:64px 24px 40px`, max-width 1240.
- Grid `1.6fr 1fr 1fr 1fr 1fr` → `1fr 1fr` at ≤900px.
- Col 1: wordmark, tagline ("The card-intelligence layer for payment platforms…"), and an **"EU-hosted · GDPR-clean"** pill (cyan dot + cyan text, `rgba(34,211,238,0.08)` bg).
- Columns: **Product** (Overview → `/product`, Try it live → `/#try`, Pricing, For platforms → `/#psp`) · **Developers** (Docs, API Reference, SDKs, Status) · **Company** (About → `/company`, Blog, Careers → `/company#careers`) · **Legal** (Privacy, Terms, DPA, GDPR).
- Bottom bar: "© 2026 FindThisBIN…" + GitHub / X / LinkedIn icon links (inline SVGs in the reference, monochrome `#9A9AAE` → `#fff` hover). `id="footer"` on the `<footer>`.
- Link colors `#9A9AAE` → `#fff` hover; uppercase column headers `#5C5C6E`, 12px, `0.08em`.

---

## Page 1 — Home (`index.astro`)
Sections, in order (alternating dark / light for rhythm):

1. **Hero** (dark). Eyebrow pill ("BIN intelligence API · EU-hosted", lime dot). H1 **"Every card, decoded in one API call."** — "one API call." uses gradient text `linear-gradient(100deg,#A98BFF,#22D3EE)` clipped to text. Subhead (the long product paragraph). Dual CTA: **Get your free API key** (lime) + **Talk to sales** (translucent). Trust strip: EU-hosted · GDPR-clean · PCI-out-of-scope · sub-10ms p99 · 99.9% uptime (each with a cyan `●`). Two-column grid (`1.05fr 1fr`, stacks ≤980px); right column is the **demo panel**:
   - Card with gradient glow border, traffic-light dots, "findthisbin · live" mono label.
   - Request line: lime `GET` badge + `https://api.findthisbin.com/v1/bins/53847012` (BIN in cyan).
   - JSON body (exact response below) where **each line fades up staggered** via `animation:ftbUp .4s ease both` + increasing `animation-delay` (0.05s → 0.72s); a blinking lime caret on the closing brace (`ftbBlink`).
   - Bottom scheme strip: "Coverage across every major scheme" + VISA / Mastercard (two-circle motif) / AMEX / Discover / JCB / UnionPay, greyscale `opacity:0.62`. **Render scheme names as plain text/generic motifs — do not use official trademarked scheme logos.**
2. **Social proof** (`#F6F6FB`). "Powering BIN intelligence for modern payment platforms" + 6 greyscale placeholder partner wordmarks (NorthPay, Volt, Cadence, Ledgerline, Orbital, Settle) + 3 stat counters that **animate from 0 on mount** (cubic ease-out, ~1.5s): **6.2M** BINs covered · **242** countries · **184M** lookups/day. *(island)*
3. **Value pillars** (`id="product"`, white). H2 "Engineered for the teams that move money." 2×2 grid (`1fr 1fr`, stacks ≤820px), emphasis order:
   - **01 · Developer experience** (dark card, violet glow, lime eyebrow) "Ships in minutes, not sprints." + mini Node code snippet.
   - **02 · EU & compliance** (light card) "EU-resident, compliance-ready." + chips: EU-hosted, GDPR-clean, PCI out-of-scope, DCC module.
   - **03 · Accuracy** (light card) "Accuracy you can underwrite." + big "8-digit" stat.
   - **04 · Performance** (dark card, cyan glow) "Built for the checkout hot path." + stats `<10ms` p99, `99.9%` uptime.
4. **Try it live** (`id="try"`, dark). H2 "Look up any BIN, right now." Interactive playground — see "BIN playground" below.
5. **What you get** (`#F6F6FB`). H2 "Every field your stack needs." Grid of field chips `repeat(auto-fill, minmax(180px,1fr))`: scheme, type, category, product/level, issuer name, issuer country, issuer currency, prepaid flag, commercial flag, regulated debit, dcc_eligible, confidence, dataset_version (dcc_eligible & confidence highlighted in violet).
6. **PSP section** (`id="psp"`, dark, violet glow). H2 "Embed card intelligence across your entire stack." 2-col: copy + CTAs (Talk to sales / See platform pricing) | 4 mini-cards (Smarter routing, Surcharging & interchange, DCC eligibility for EU flows, Richer checkout UX & risk).
7. **Use cases** (white). H2 "One dataset, six revenue levers." `auto-fill minmax(300px,1fr)` grid of 6 cards (Least-cost & debit routing · Surcharging & interchange · DCC eligibility (EU) · Checkout UX & card art · Fraud & risk signals · Batch data enrichment), violet border on hover.
8. **How it works** (dark). H2 "Three steps to rich card data." 2-col: 3 numbered steps | **code panel with language tabs** (cURL, Node, Python, Go, PHP) — see "Code tabs".
9. **Performance band** (animated signature gradient). 5 big stats: `<10ms` p99 · `99.9%` uptime · `6.2M` BINs · `242` countries · `EU` residency. Sub-line "GDPR · PCI out-of-scope · SOC 2 (in progress)".
10. **Pricing preview** (`#F6F6FB`). H2 "Start free. Scale on usage." 4 cards (Free €0 / Pay-as-you-go €0.004 / **Growth €499** highlighted dark with "MOST POPULAR" lime badge / Enterprise Custom). Link "Compare all plans & features →" to `/pricing`.
11. **Compliance callout** (white). `F6F6FB` rounded panel, `auto-fit minmax(190px,1fr)`: EU residency · GDPR-clean · Out of PCI scope · DPA available (each violet title + one line).
12. **Dev/docs CTA** (dark, faint grid background `linear-gradient` 32px grid). H2 "Everything you need to integrate in minutes." 2-col: copy + CTAs (Read the docs / API reference) | 2×2 link cards (Docs, API Reference, SDKs, Postman) with mono accents, cyan border on hover.
13. **Final CTA** (`linear-gradient(125deg,#0B0B12,#241a52 45%,#3B82F6 130%)` + violet glow blob). H2 **"Start building with FindThisBIN today."** + Get your free API key / Talk to sales.
14. **Footer.**

## Page 2 — Pricing (`pricing.astro`)
1. **Header** (dark, violet glow). Eyebrow pill. H1 "Pricing that scales with your volume." Subhead. **Monthly/Annual segmented toggle** (annual shows "–20%" in lime). *(island)* Default = Annual.
2. **Tiers** (`id="tiers"`, `#F6F6FB`). 4 cards (`repeat(4,1fr)` → `1fr 1fr` ≤1040px → `1fr` ≤560px), Growth highlighted dark with "MOST POPULAR" badge & shadow. Growth price reacts to toggle: **€399/mo · billed annually** (annual) / **€499/mo · billed monthly** (monthly). Each card: name, audience line, price, included-volume line, CTA, feature `✓` list (violet checks on light, cyan checks on the dark Growth card). Exact tiers/prices/copy in `Pricing.dc.html`.
3. **Comparison table** (white). H2 "Compare every plan." Horizontally scrollable on mobile (`overflow-x:auto`, table `min-width:760px`), rounded bordered container. Header row `#F6F6FB` with Free / PAYG / **Growth** (violet) / Enterprise. 15 rows — render `✓` as green check `#1FA463`, `—` as muted dash `#C5C5D0`, text values bold. Rows & values (Free | PAYG | Growth | Enterprise):
   - Monthly lookups included: 5,000 | Metered | 250,000 | Custom
   - Overage rate: — | €0.004 | €0.003 | Volume
   - 8-digit range data: ✓ | ✓ | ✓ | ✓
   - Per-field confidence: ✓ | ✓ | ✓ | ✓
   - Multi-source corrections: — | ✓ | ✓ | ✓
   - DCC module: — | — | ✓ | ✓
   - Surcharging & interchange intelligence: — | ✓ | ✓ | ✓
   - Network-token indicators: — | — | ✓ | ✓
   - EU data-residency guarantee: — | — | ✓ | ✓
   - Uptime SLA: — | — | 99.9% | Custom
   - Support level: Community | Email | Priority | Dedicated
   - Dataset export: — | — | — | ✓
   - On-prem / private deployment: — | — | — | ✓
   - DPA: — | ✓ | ✓ | ✓
   - SOC 2: — | Roadmap | Roadmap | ✓
4. **Volume callout** (signature-gradient rounded panel on dark). "Doing millions of lookups a month?" + "Talk to sales" white button.
5. **FAQ accordion** (`#F6F6FB`, max-width 820). 8 items, single-open (first open by default), `+`/`–` toggle in violet. Questions & answers verbatim in `Pricing.dc.html` (what counts as a lookup, free tier no card, annual billing, overage, EU hosting, no full PANs, self-host/on-prem, cancel). *(island)*
6. **Close** (gradient + glow). Trust strip (EU-hosted · GDPR-clean · No PCI scope · DPA available) + H2 "Get your free API key today." + dual CTA.
7. **Footer.**

## Page 3 — Docs (`docs.astro`) — light theme, dark code panels
1. **Header** (`#F6F6FB`, bottom border). Mono eyebrow `// docs`. H1 "Build with FindThisBIN." Subhead "From your first BIN lookup to production in minutes." **Search bar** (white, magnifier SVG, `⌘K` hint pill) — cosmetic input.
2. **Quickstart** (white). 2-col (`1fr 1.1fr`, stacks ≤900px): dark gradient card (`linear-gradient(160deg,#0B0B12,#1a1340)`, violet glow) with "5-minute quickstart" pill, "First lookup in three steps", 3 numbered steps, "Start here" lime CTA | **code panel with tabs (cURL / Node / Python)** + a "→ 200 OK" footer line. *(island for tabs)*
3. **Documentation grid** (`#F6F6FB`). `repeat(3,1fr)` → 2 → 1. 9 cards (mono token icon + title + one line): Quickstart, Authentication, BIN Lookup API, Batch Lookup, DCC endpoint, Webhooks, Errors & rate limits, Data dictionary, Versioning. Violet border + `translateY(-2px)` on hover.
4. **SDKs & tools** (`id="sdks"`, white). Header + "OpenAPI spec ↓" / "Postman collection →" links. `repeat(3,1fr)` → 2 → 1 grid of dark cards with install snippets: Node `npm i findthisbin`, Python `pip install findthisbin`, Go `go get findthisbin.com/go`, PHP `composer require findthisbin/sdk`, Java `implementation 'com.findthisbin:sdk'`, + a gradient "All SDKs are open source / View on GitHub" card.
5. **API reference** (`id="reference"`, dark). 2-col (`1fr 1.3fr`): copy + "Open reference" CTA | code panel with `GET /v1/bins/{bin}` (cyan verb badge, `{bin}` in violet), Authorization header, and the JSON response (reuse the hero example, abbreviated).
6. **Guides** (`#F6F6FB`). H2 "Guides." `auto-fill minmax(280px,1fr)` of 4 link rows: Detecting prepaid & commercial cards · DCC compliance in the EU (ECB rates) · The 8-digit BIN migration · Working with match confidence.
7. **Docs utility bar** (white, top border). Status (green dot) · Changelog · Support + persistent "Get your free API key" lime CTA.
8. **Footer.**

---

## Page 4 — Product (`product.astro`) — dark/light rhythm
1. **Hero** (dark, centered). Eyebrow "Product". H1 "The card-intelligence layer for **payment platforms.**" (last phrase gradient-clipped). Subhead + dual CTA (api-key / sales).
2. **Anatomy of a lookup** (white). 2-col: copy + 4 grouped bullets (Identity / Issuer / Flags & DCC / Provenance) | dark code panel showing `GET /v1/bins/{bin}` + the canonical JSON.
3. **Capabilities** (`#F6F6FB`). H2 "Four things we obsess over." Same 2×2 pillar grid as Home (DX dark / EU light / Accuracy light / Performance dark), copy tightened.
4. **Endpoints** (dark). H2 "Three endpoints. Everything you need." 3 cards: `GET /v1/bins/{bin}` Single lookup · `POST /v1/bins/batch` Batch (≤10k) · `GET /v1/dcc/{bin}` DCC disclosure. Link → `/docs#reference`.
5. **Fits your stack** (white). H2 "Plugs into every decision in your flow." 6 cards (same six use cases as Home, one line each).
6. **Coverage stats** (gradient band): 6.2M BINs · 242 countries · 8-digit · <10ms.
7. **CTA** (gradient): "See it on your own BINs." + dual CTA. **Footer.**

## Page 5 — Company (`company.astro`)
1. **Hero** (dark). Eyebrow "Company". H1 "Building the trust layer for **payments.**" + mission subhead.
2. **Mission / story** (white). 2-col: H2 "BIN data was stuck in the 6-digit era. Payments moved on." | 3 short paragraphs (full copy in `Company.dc.html`).
3. **Principles** (`#F6F6FB`). H2 "Principles we build on." 4 numbered cards: Precision over guesswork · Developer-first · EU-resident by default · Out of PCI scope.
4. **Stats band** (gradient): EU residency · 242 countries · 6.2M BINs · 99.9% uptime.
5. **Careers** (`id="careers"`, dark). H2 "Come build payments infrastructure." + 3 placeholder roles (title + "Remote (EU) · Full-time" + "View role →") + "Get in touch" CTA → `/contact?intent=sales`. The footer Careers link targets `#careers`.
6. **Final CTA** (gradient). **Footer.**

## Page 6 — Contact / Book-a-demo (`contact.astro`) + Slack webhook
The single destination for **both** primary CTAs, switched by `?intent=`:
- `?intent=api-key` (default) — "Get your free API key." Self-serve framing; CTA "Get my API key"; success "You're all set. Check your inbox…".
- `?intent=sales` — "Let's talk volume." Adds a **Role** field; CTA "Request a call"; success "Request received…".

**Layout** (dark, 2-col `0.85fr 1fr`, stacks ≤940px): left = intent-driven heading/subhead + 3 reassurance check-rows + a "What happens next" card with a contact-email link; right = form card with gradient glow border.

**Fields:** Full name\*, Work email\*, Company\* (name+email in a 2-col row), Role (sales only), Expected monthly lookups (`<select>`: Just exploring / Under 100k / 100k–1M / 1M–10M / 10M+), Message (textarea; label switches "What are you building?" ↔ "Anything we should know?"). Validate: name non-empty, email `^[^@\s]+@[^@\s]+\.[^@\s]+$`, company non-empty; inline errors (border `rgba(255,128,149,0.6)`, text `#FF8095`). Inputs: bg `#10101C`, border `rgba(255,255,255,0.12)`, radius 10px, focus → violet border + `0 0 0 3px rgba(124,92,255,0.18)`. Submit = lime, disabled + "Sending…" while submitting. A link below the form toggles intent and updates the `?intent=` query.

**On submit → Slack message via webhook.** *Do NOT call the Slack webhook from the browser* — the URL must stay secret and Slack blocks browser CORS. Wire it server-side:
1. The form POSTs the field values to an Astro endpoint **`src/pages/api/contact.ts`** (`export const prerender = false;`, with an SSR adapter such as `@astrojs/node` / Vercel / Netlify — the marketing pages stay static).
2. That endpoint reads `SLACK_WEBHOOK_URL` from a server env var and `fetch`es it with a Block Kit payload, then returns `{ ok: true }`.

```ts
// src/pages/api/contact.ts
export const prerender = false;
export async function POST({ request }) {
  const d = await request.json();
  const label = d.intent === 'sales' ? 'Talk to sales' : 'Free API key';
  const payload = {
    text: `New ${label} request — FindThisBIN`,
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: `📥 New ${label} request` } },
      { type: 'section', fields: [
        { type: 'mrkdwn', text: `*Name:*\n${d.name}` },
        { type: 'mrkdwn', text: `*Work email:*\n${d.email}` },
        { type: 'mrkdwn', text: `*Company:*\n${d.company}` },
        { type: 'mrkdwn', text: `*Role:*\n${d.role || '—'}` },
        { type: 'mrkdwn', text: `*Monthly lookups:*\n${d.volume}` },
        { type: 'mrkdwn', text: `*Intent:*\n${d.intent}` },
      ] },
      { type: 'section', text: { type: 'mrkdwn', text: `*Message:*\n${d.message || '—'}` } },
    ],
  };
  const r = await fetch(import.meta.env.SLACK_WEBHOOK_URL, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
  });
  return new Response(JSON.stringify({ ok: r.ok }), { status: r.ok ? 200 : 502 });
}
```

Set `SLACK_WEBHOOK_URL` in `.env` and your host's env. Create it in Slack → *Apps → Incoming Webhooks → Add to a channel*. Add a honeypot field + basic rate limiting before launch. The reference `Contact.dc.html` builds this exact payload in `buildSlackPayload()` and simulates the round-trip (it `console.log`s the payload and shows the success state) — swap the simulation for a real `fetch('/api/contact', …)`.

## CTA wiring (global)
Every primary CTA points to the contact page, by intent:
- **"Get your free API key"** (nav button, hero, the pricing tiers' Start free / Get your API key / Start free trial, all closers, docs utility bar) → **`/contact?intent=api-key`**.
- **"Talk to sales"** (hero, PSP, enterprise tier, volume callout, all closers, company "Get in touch") → **`/contact?intent=sales`**.
- **"Sign in"** (nav only) stays a placeholder (`#`).

---

## Canonical API example (use everywhere code appears)
Request line:
```
GET https://api.findthisbin.com/v1/bins/53847012
```
Response JSON:
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
cURL:
```bash
curl https://api.findthisbin.com/v1/bins/53847012 \
  -H "Authorization: Bearer sk_live_..."
```

---

## Interactions & Behavior (islands)

### Nav scroll + mobile menu
- Scroll listener (passive): toggle `scrolled` state at `scrollY > 12` → swap bg/border. Cleanup on unmount.
- Mobile: `menuOpen` boolean toggled by hamburger; panel shown below the bar.

### Stat counters (Home social-proof)
- On mount, `requestAnimationFrame` loop, duration ~1500ms, ease-out cubic `1 - (1-t)^3`. Targets: bins 6.2 → format `"6.2M"`; countries 242 → integer; lookups 184 → `"184M"`. Consider firing on intersection so it animates when scrolled into view.

### BIN playground (Home "Try it live")
- Controlled text input (`maxlength=8`, numeric) bound to `bin` state; quick-pick chips set the value: `53847012`, `45717360`, `37828224`, `40128210`.
- Lookup logic: strip non-digits, take first 8. If the BIN matches a known sample, return that record; otherwise **synthesize a deterministic best-guess** (lower confidence) from the digits.
- **Known samples** (port this map):
  | bin | scheme | type | category | product | issuer | country | currency | prepaid | commercial | regulated_debit | dcc | confidence |
  |---|---|---|---|---|---|---|---|---|---|---|---|---|
  | 53847012 | Mastercard | Credit | Consumer | World Elite Mastercard | Revolut Ltd | GB | GBP | false | false | false | true | 0.98 |
  | 45717360 | Visa | Debit | Consumer | Visa Classic Debit | BNP Paribas | FR | EUR | false | false | true | true | 0.97 |
  | 37828224 | Amex | Charge | Commercial | Business Platinum Card | American Express | US | USD | false | true | false | false | 0.95 |
  | 40128210 | Visa | Prepaid | Consumer | Visa Prepaid Reloadable | Wise Payments | BE | EUR | true | false | false | true | 0.93 |
- **Synthesis rules** (deterministic from digits, for any other input): scheme by first digit (4=Visa, 2/5=Mastercard, 3=Amex, 6=Discover, else Unknown); let `sum` = sum of digits; `type = ['Credit','Debit','Prepaid','Charge'][sum%4]`; `commercial = sum%5===0`; country = `['DE','FR','ES','NL','IT','US','GB','PL','IE','SE'][sum%10]` with matching currency (EUR/USD/GBP/PLN/SEK); issuer = `['Deutsche Bank','Santander','ING Group','UniCredit','Barclays','Citi','Nordea','Raiffeisen'][sum%8]`; prepaid = type==='Prepaid'; regulated_debit = type==='Debit' && sum%2===0; dcc = scheme!=='Amex'; confidence = `0.84 + (sum%9)/100`; mark `bestGuess:true`.
- Result card renders: Scheme, Type, Issuer (+ product line), Country, Currency, DCC (cyan "Eligible" / muted "Not eligible"), Flags (Prepaid / Commercial / Regulated debit — `✓` lime chip when true, muted `✕` when false), and a **Confidence bar** (gradient fill, width = confidence %) with a hint line: "Exact 8-digit range match" vs "Best-guess match · lower confidence", plus "Dataset version 2026-06-12".

### Code language tabs (Home "How it works"; Docs quickstart)
- Active-tab state; clicking a tab swaps the visible highlighted code block. Active tab style: lime text `#C4F542`, `rgba(196,245,66,0.12)` bg, lime border; inactive muted with faint border. Home has cURL/Node/Python/Go/PHP; Docs has cURL/Node/Python. Snippet contents are in the reference files.

### Pricing toggle + FAQ
- Monthly/Annual toggle swaps Growth price/sub-label (see Page 2). Active segment = white pill on translucent track.
- FAQ: single-open accordion, item 0 open by default; `+`↔`–`.

### Hover/transitions
- Buttons: `translateY(-1px/-2px)` + intensified shadow, ~0.15s.
- Cards: border → `#7C5CFF` (light) or `rgba(34,211,238,0.5)` (dark), some `translateY(-2px)`.
- All color transitions ~0.15–0.3s ease.

## Responsive behavior
Mobile-first. Breakpoints used in the prototype: **860px** (nav collapses), **980px** (hero stacks), **900px** (2-col sections + footer + docs 2-col stack), **820px** (pillars stack), **1040px / 560px** (pricing 4→2→1), **600px** (stat trio stacks). Fluid type/spacing via `clamp()` (values above) reduces the number of hard breakpoints needed. Comparison table scrolls horizontally under 760px. **Accessibility:** maintain WCAG AA contrast on dark sections (the muted greys above are chosen for this), semantic landmarks (`<header><nav><main><section><footer>`), keyboard-operable toggles/accordions/tabs (real `<button>`s, `aria-expanded`), and visible focus states.

## Assets
- **Fonts:** Space Grotesk, IBM Plex Sans, IBM Plex Mono (Google Fonts / Astro fonts) — no local files. See the Typography section for the exact `fonts` config and the weight note.
- **Icons:** inline SVGs only (search magnifier, footer GitHub/X/LinkedIn). No icon library required; copy the SVG paths from the reference files or use your preferred set.
- **Logos:** FindThisBIN is a **text wordmark** (no image). Partner logos are placeholder text wordmarks — replace with real customer logos when available. Card-scheme names are rendered as plain text / generic motifs; **do not introduce official trademarked scheme logo files.**
- **No raster images** are used anywhere — all visuals are CSS gradients, glows, and type.

## Files in this bundle
`design_files/` contains the HTML design references (open in a browser to preview):
- `Home.dc.html` — landing page (all 14 sections + interactions/logic)
- `Product.dc.html` — product/feature deep-dive
- `Pricing.dc.html` — pricing page (toggle, table, FAQ)
- `Docs.dc.html` — docs landing
- `Company.dc.html` — about + careers (`#careers`)
- `Contact.dc.html` — book-a-demo / get-API-key form (intent switch, validation, Slack payload in `buildSlackPayload()`)
- `Nav.dc.html` — shared nav (scroll/mobile logic, active states for all 5 nav targets)
- `Footer.dc.html` — shared footer
- `support.js` — prototype runtime (reference only; **do not port to Astro**)

The exact copy, snippet contents, FAQ text, and inline values not transcribed above are all present in these files — treat them as the source of truth alongside this README.
