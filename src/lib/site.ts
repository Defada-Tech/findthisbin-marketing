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

/* Internal routes */
export const HOME_PATH = "/";
export const PRODUCT_PATH = "/product";
export const PRICING_PATH = "/pricing";
export const DOCS_PATH = "/docs";
export const COMPANY_PATH = "/company";
export const CONTACT_PATH = "/contact";

/* Primary CTAs — keep labels identical everywhere they appear. All route
   through the on-site contact form, switched by the `intent` query param.
   There is no self-serve signup: the primary action is "Book a demo". */
export const BOOK_DEMO_LABEL = "Book a demo";
export const BOOK_DEMO_URL = "/contact?intent=demo";
export const TALK_TO_SALES_LABEL = "Talk to sales";
export const TALK_TO_SALES_URL = "/contact?intent=sales";
/* Home secondary CTA → the deployment-models section anchor. */
export const SEE_DEPLOYMENT_LABEL = "See deployment options";
export const SEE_DEPLOYMENT_URL = "/#deployment";

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
  "Runs in your cloud",
  "Your data never leaves",
  "Out of PCI scope",
  "EU-hosted option",
  "sub-10ms p99",
] as const;
