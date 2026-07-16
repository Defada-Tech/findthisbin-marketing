/**
 * Site-wide config — centralize routes, labels, and external URLs here rather
 * than hardcoding in pages. The external URLs below are placeholders for the
 * future product dashboard / channels; update them when those exist.
 */

export const SITE_NAME = "FindThisBIN";
export const SITE_TAGLINE =
  "The BIN intelligence engine for payment platforms.";
export const SITE_DESCRIPTION =
  "A deployable BIN intelligence engine for payment platforms. Run it in your own cloud (self-hosted, managed, or fully managed), plug in your data licenses, and turn any BIN into a typed, scored card record — your data never leaves your environment.";

/* Engine host shown in code/demo URLs — signals self-hosting (vs a hosted API). */
export const ENGINE_BASE_URL = "https://bins.internal";

/**
 * Cloudflare Web Analytics beacon token (§11). Cookieless, so no consent banner.
 *
 * Injected at build time by Vite `define` in astro.config.mjs, which reads
 * `.dev.vars` first and falls back to `process.env.CF_ANALYTICS_TOKEN`. The
 * infrastructure module manages the Web Analytics site via Terraform and exports
 * its token: `cd infra && tofu output cf_analytics_token`. Set it in
 * `.dev.vars` (gitignored) for local dev, or export it in CI. Leave it unset to
 * keep analytics off — that is the honest default.
 *
 * Setting it does three things at once, by construction rather than by
 * remembering: the beacon renders (Analytics.astro), the CSP gains the two
 * cloudflareinsights origins (securityHeaders.ts), and privacy.astro's
 * analytics paragraph becomes true. Leave it unset and all three stay off
 * together — which is why privacy.astro currently says nothing about analytics.
 *
 * After setting it: `npm run headers && npm run conform && npm run build`, then
 * confirm the dashboard receives data. A CSP block is silent — the dashboard is
 * the only proof.
 */
export const CF_ANALYTICS_TOKEN: string =
  import.meta.env.CF_ANALYTICS_TOKEN ?? "";

/* Internal routes. Every path carries a trailing slash to match
   `trailingSlash: "always"` (§2) — that is the one URL form this site serves,
   canonicalizes, and sitemaps. A bare path here costs a 307 on every click. */
export const HOME_PATH = "/";
export const PRODUCT_PATH = "/product/";
export const FEATURES_PATH = "/features/";
export const COMPANY_PATH = "/company/";
export const CONTACT_PATH = "/contact/";
export const PRIVACY_PATH = "/privacy/";
export const TERMS_PATH = "/terms/";
export const DPA_PATH = "/dpa/";
export const GDPR_PATH = "/gdpr/";

/* The form endpoint. Slashed like every other path, and for the same reason:
   `trailingSlash: "always"` applies to API routes too, so a bare action makes
   every submit pay a 308 before the POST is replayed against the slashed URL. */
export const API_CONTACT_PATH = "/api/contact/";

/* Primary CTAs — keep labels identical everywhere they appear. All route
   through the on-site contact form, switched by the `intent` query param.
   There is no self-serve signup: the primary action is "Book a demo".

   The URLs are DERIVED from CONTACT_PATH rather than spelled out: the path is
   then typed once (§7), and the trailing slash lands in the right place — before
   the query string — automatically. */
export const BOOK_DEMO_LABEL = "Book a demo";
export const BOOK_DEMO_URL = `${CONTACT_PATH}?intent=demo`;
export const TALK_TO_SALES_LABEL = "Talk to sales";
export const TALK_TO_SALES_URL = `${CONTACT_PATH}?intent=sales`;
/* Home secondary CTA → the deployment-models section anchor. HOME_PATH is "/",
   so the anchor form is already canonical. */
export const SEE_DEPLOYMENT_LABEL = "See deployment options";
export const SEE_DEPLOYMENT_URL = `${HOME_PATH}#deployment`;

/* Trust strip — reused on hero + pricing close. */
export const TRUST_POINTS = [
  "Runs in your cloud",
  "Your data never leaves",
  "Out of PCI scope",
  "EU-hosted option",
  "sub-10ms p99",
] as const;
