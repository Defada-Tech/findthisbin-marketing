/**
 * Site-wide config — centralize routes, labels, and external URLs here rather
 * than hardcoding in pages. The external URLs below are placeholders for the
 * future product dashboard / channels; update them when those exist.
 */

export const SITE_NAME = "FindThisBIN";
export const SITE_TAGLINE =
  "The card-intelligence layer for payment platforms.";
export const SITE_DESCRIPTION =
  "A developer-first BIN intelligence API for payment platforms. Scheme, type, issuer, country, DCC eligibility and fraud signals for every card — EU-hosted, GDPR-clean, sub-10ms p99.";

/* Internal routes */
export const HOME_PATH = "/";
export const PRICING_PATH = "/pricing";
export const DOCS_PATH = "/docs";

/* Primary CTAs — keep labels identical everywhere they appear. */
export const GET_API_KEY_LABEL = "Get your free API key";
export const GET_API_KEY_URL = "https://app.findthisbin.com/signup";
export const TALK_TO_SALES_LABEL = "Talk to sales";
export const TALK_TO_SALES_URL = "mailto:sales@findthisbin.com";

/* External app / developer surfaces (placeholders for the live dashboard). */
export const SIGN_IN_URL = "https://app.findthisbin.com/login";
export const API_REFERENCE_URL = "https://app.findthisbin.com/reference";
export const OPENAPI_SPEC_URL = "https://app.findthisbin.com/openapi.yaml";
export const POSTMAN_URL = "https://www.postman.com/findthisbin";
export const STATUS_URL = "https://status.findthisbin.com";

/* Social */
export const GITHUB_URL = "https://github.com/findthisbin";
export const X_URL = "https://x.com/findthisbin";
export const LINKEDIN_URL = "https://www.linkedin.com/company/findthisbin";

/* Trust strip — reused on hero + pricing close. */
export const TRUST_POINTS = [
  "EU-hosted",
  "GDPR-clean",
  "PCI out-of-scope",
  "sub-10ms p99",
  "99.9% uptime",
] as const;
