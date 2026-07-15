# FindThisBIN — Claude Design Addendum (Enterprise Infrastructure Repositioning)

**How to use this file.** Apply these changes on top of `findthisbin-design-brief.md`. Where this addendum conflicts with the original, **this wins.** Keep everything not mentioned here — the bold modern fintech identity, the violet/indigo + lime/cyan palette, the typography, the code panels, the responsiveness and accessibility, and the three-page structure (Home / Pricing / Docs). This is a repositioning, not a redesign.

---

## What changed

The product pivoted from a self-serve developer BIN API to a **deployable BIN intelligence engine** that PSPs run in their own cloud (or have us run for them), plugging in **their own** data licenses. So the site shifts from "sign up and call the API" to **enterprise infrastructure sold to payment platforms** — build-vs-buy, deploy-in-your-cloud, compliance, and ops. Keep the bold, confident aesthetic, but add the trust and substance an infra buyer expects.

---

## Global changes (apply across all three pages)

- **CTAs:** the primary action everywhere becomes **"Book a demo"** (or "Talk to sales"). **Remove "Get your free API key" / "Start free" entirely** — there is no self-serve signup. Secondary action: "See deployment options" or "Read the docs." Keep a low-key "Sign in" in the nav for existing customers, but the nav's primary button is "Book a demo."
- **Audience framing:** still PSPs / payment platforms in the hero, but as **infrastructure buyers** — speak to both the platform decision-maker (compliance, time-to-value, build-vs-buy) and their engineers (clean API, deploy in your stack).
- **Messaging emphasis, new order:** (1) **deploy in your cloud / we handle the ops**, (2) **compliance & data residency** (your data never leaves your environment; we're out of PCI scope and the card/data path), (3) **build-vs-buy / time-to-value**, (4) the engine's **correctness & performance** (8-digit, multi-source, sub-10ms), with **developer experience** reframed as "your team integrates a clean API," not self-serve onboarding. Fraud stays a minor supporting use case.
- **Tone:** keep the bold energy, add enterprise-trust signals (security, compliance, deployment). "Infrastructure you can trust" alongside "developer-grade."

---

## PAGE 1 — HOME (deltas)

- **Hero headline** → reposition to the engine/deployment story. Options:
  - "Production BIN intelligence, in your cloud, in days."
  - "Bring your licenses. We bring the engine."
  - "The BIN intelligence engine payment platforms run themselves."
- **Hero subhead:** "Deploy a fast, multi-source BIN engine in your own cloud — or let us run it for you. Plug in your own data licenses (Visa VBASS, Mastercard, commercial, CSV); we handle the 8-digit logic, the merging, the sub-10ms performance, and the ops. Your data never leaves your environment."
- **Hero CTA:** "Book a demo" + "See deployment options." (No free key.)
- **Hero visual:** keep a beautiful syntax-highlighted JSON response as proof of the engine's output, but pair it with a **deployment motif** — a simple diagram of the engine running inside the customer's cloud with their licensed sources plugged in. The visual should say "this runs in *your* environment," not "call our hosted API."
- **Trust strip:** "Runs in your cloud · Your data never leaves · Out of PCI scope · EU-hosted option · sub-10ms p99."
- **Value pillars** → re-order and reframe to the new emphasis: Deploy-in-your-cloud (+ managed option) · Compliance & data residency (out of the data path, processor model, DPA) · Build-vs-buy / time-to-value · Correctness & performance (8-digit, multi-source, hot path). Developer experience folds into "your engineers integrate a clean API."
- **Replace** the self-serve "try it live" playground emphasis: keep an interactive lookup demo as a *product* demonstration, but the conversion goal is "Book a demo," not "get a key."

### New Home sections (add these)

- **Deployment models** (centerpiece — three cards):
  - *Self-hosted / BYOC* — run it in your own cloud, VPC, or on-prem; air-gappable. "Your infrastructure, your data, your control."
  - *Managed in your cloud* — we deploy and operate it inside your environment; you keep the data, we keep it running.
  - *Fully managed (BYOL)* — we host and operate it; you onboard as an isolated tenant and bring your licenses. "Zero infra, zero ops — your data stays isolated and yours."
  Make clear all three run the same engine; the difference is who operates it.
- **Bring your own licenses / connectors:** the connector catalog — Visa VBASS, Mastercard BIN table, commercial providers, CSV upload — plus bundled open seed data ("works on day one") and the provider-brokerage help ("don't have a license yet? we'll help you connect to providers"). Message: "Plug in your licenses; we did the integration and the hard logic."
- **Compliance & data residency:** your data stays in your environment; we're out of PCI scope and out of the card/data path; processor model with per-customer DPA; EU hosting; SOC 2 (in progress). A reassurance band aimed squarely at procurement.
- **Build vs. buy:** two columns — what you'd build and maintain in-house (8-digit range logic, multi-source merge with confidence, the sub-10ms hot path, freshness/versioning, ongoing ops as networks change their files) vs. what you get on day one. Time-to-value framing: "months of specialist work, or a deployment this week."
- **How it works** → reframe the 3 steps from "get a key → call API" to **"Deploy in your cloud → Connect your licenses → Integrate the API,"** keeping the code tabs for the integration step.

Keep the use-cases section (routing, surcharging, DCC, checkout UX, fraud signals, enrichment) and the performance/trust band.

---

## PAGE 2 — PRICING (deltas)

- Reposition from self-serve prices to **contact-driven enterprise tiers.** Replace per-lookup/free messaging with **"Talk to sales" / "Request pricing"** on each tier.
- Tiers → **Startup** (single deployment, core engine + base connectors, community support) · **Growth** (HA, more connectors, SLA, standard support) · **Enterprise** (multi-environment, the fully-managed option, premium connectors, dedicated support, custom SLAs). Highlight Growth or Enterprise.
- **Feature-comparison table** → swap the per-lookup rows for infrastructure rows: **deployment modes available** (self-host / managed-in-your-cloud / fully-managed), included connectors, bundled seed data, DCC & surcharging modules, EU-residency / data-residency, uptime SLA, support level, managed-ops, DPA, SOC 2.
- **Remove** "no credit card / start free." Add the **POC** as the evaluation path: "Evaluate with a proof-of-concept deployed in your cloud using bundled seed data."
- Keep the volume/enterprise callout and a pricing FAQ, reframed (What deployment options are there? Where does my data live? Do you ever see my card data? — no, BIN-only and out of the path. Can you host it for us? What licenses do I need to bring?).

---

## PAGE 3 — DOCS LANDING (deltas)

- Reframe from "sign up and call the API" to **"deploy, connect, and integrate the engine."** Keep the developer-grade, scannable, code-heavy aesthetic.
- **Quickstart** → "Deploy in your cloud in 15 minutes" (deploy the engine → connect a data source → make your first lookup), rather than "get an API key."
- **Doc grid** → add deployment & operations topics alongside the API docs: **Deployment (self-host / managed / multi-tenant)**, **Connecting data sources (VBASS, Mastercard, commercial, CSV)**, **License configuration**, **Tenant setup** (for the managed option), **Upgrades & operations**, **Observability** — plus the existing BIN Lookup API, Batch, DCC, Webhooks, Errors, Data dictionary, Versioning.
- **SDKs & API reference** stay (engineers still integrate a clean API), but the framing is "integrate the engine you've deployed," not "consume our hosted API."
- Keep the guides, status/changelog/support links, and the footer — but the persistent CTA becomes **"Book a demo."**

---

## What to keep (do not change)

The logo (designed separately), the color system and gradient/glow motif, the typography, the syntax-highlighted code panels, the motion language, mobile-first responsiveness, and WCAG AA contrast. The brand should still feel like a premium, bold, modern payments-infrastructure company — now clearly selling an engine you deploy, not a hosted data API.
