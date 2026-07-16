/**
 * The §10 security header set — the single source of truth for this site.
 *
 * WHY THIS EXISTS AS CODE AND NOT JUST public/_headers:
 * `_headers` is applied by the Workers *static-asset* layer. The adapter emits
 * no `run_worker_first`, so routing is asset-first / Worker-on-miss — and a
 * `prerender = false` route has no asset to miss. `/contact/` therefore reaches
 * the Worker and returns with NO CSP, HSTS, or nosniff. Verified locally:
 * `/` and `/product/` carry the full set; `/contact/` carried nothing.
 *
 * That is the worst possible split: the two pages on these sites that accept
 * user input are the only two the policy did not cover.
 *
 * So: `_headers` covers assets (no runtime cost on the hot path), and
 * `src/middleware.ts` applies this same set to SSR responses. Both read from
 * here, and `scripts/conform.mjs` asserts `public/_headers` still matches this
 * object — otherwise the two drift and only one of them is tested.
 *
 * Keep byte-identical to the sibling sites (§10) except where a site genuinely
 * differs.
 */
import { CF_ANALYTICS_TOKEN } from "./site";

/**
 * Cloudflare Web Analytics origins (§11). The beacon and the CSP that permits it
 * are DERIVED FROM THE SAME CONSTANT on purpose.
 *
 * §10 states the rule as "analytics widens the CSP in the same commit, or the
 * beacon silently never loads." That is a rule a human has to remember, about a
 * failure that is invisible when you get it wrong — the beacon just quietly
 * reports nothing. So don't rely on remembering: set CF_ANALYTICS_TOKEN and both
 * the <script> and these origins appear together; leave it empty and neither
 * does. `npm run headers` regenerates public/_headers from this module, and
 * conform.mjs fails the build if the file has drifted from it.
 */
const ANALYTICS_ENABLED = CF_ANALYTICS_TOKEN.length > 0;
const CF_SCRIPT_SRC = ANALYTICS_ENABLED
  ? " https://static.cloudflareinsights.com"
  : "";
const CF_CONNECT_SRC = ANALYTICS_ENABLED
  ? " https://cloudflareinsights.com"
  : "";

export const SECURITY_HEADERS: Record<string, string> = {
  "Content-Security-Policy": [
    "default-src 'self'",
    `script-src 'self'${CF_SCRIPT_SRC}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    `connect-src 'self'${CF_CONNECT_SRC}`,
    "object-src 'none'",
    "base-uri 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
  ].join("; "),
  "Strict-Transport-Security": "max-age=31536000",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Cross-Origin-Opener-Policy": "same-origin",
};

/** Render the set in Cloudflare `_headers` syntax, for conform.mjs to compare. */
export function toHeadersFile(): string {
  const lines = Object.entries(SECURITY_HEADERS).map(
    ([k, v]) => `  ${k}: ${v}`,
  );
  return `/*\n${lines.join("\n")}\n`;
}
