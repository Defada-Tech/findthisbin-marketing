#!/usr/bin/env node
/**
 * Conformance gate for MARKETING_TECH_STACK.md (§12).
 *
 * Plain Node, zero dependencies, copied per repo like the component core (§16).
 * Asserts the invariants that are mechanically checkable. Runs in CI:
 *   npm run check && npm run conform && npm run build
 *
 * The point is §20.9 — "the spec and the code agree." A checklist a human reads
 * holds for two repos and one author. This is what makes it hold for six repos
 * and agent-authored changes.
 *
 * Adding a check: keep it greppable, keep the failure message actionable (say
 * what to DO, not just what is wrong), and never make it pass by loosening it.
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";
import { renderHeaders } from "./headers.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const R = (p) => join(root, p);
const read = (p) => readFileSync(R(p), "utf8");
const has = (p) => existsSync(R(p));

const failures = [];
const fail = (check, detail) => failures.push({ check, detail });
let checks = 0;
const ok = () => checks++;

/* ── Hex allowlist ────────────────────────────────────────────────────────────
 * The two sanctioned exceptions from §4. This is NOT an ignore-list: every hex
 * in these files must still be a member of :root (asserted below). `reason` is
 * mandatory — an exception whose reason nobody wrote down outlives its cause.
 */
const HEX_ALLOWLIST = [
  {
    file: "src/lib/codeTheme.ts",
    reason:
      "Shiki resolves theme colors into inline styles at build time; the highlighter cannot consume var(--x).",
  },
  {
    file: "src/components/BaseHead.astro",
    reason:
      "<meta name='theme-color'> is an HTML attribute; the UA does not parse var() there.",
  },
];

/* ── Helpers ─────────────────────────────────────────────────────────────── */

const walk = (dir, out = []) => {
  for (const e of readdirSync(R(dir))) {
    const p = join(dir, e);
    if (statSync(R(p)).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
};

const normHex = (h) => {
  let x = h.slice(1).toLowerCase();
  if (x.length === 3 || x.length === 4) x = [...x].map((c) => c + c).join("");
  return "#" + x;
};

/**
 * Blank out comments before scanning for colors, preserving offsets so the
 * :root region math still lines up.
 *
 * Prose ABOUT a color is not a color. Without this, documenting why a token
 * exists ("--review was missing while `rgba(212, 164, 40, …)` shipped") trips
 * the very check the comment explains — which teaches people to delete the
 * explanation. A gate that punishes documentation is a bad gate.
 */
const stripComments = (s) =>
  s
    .replace(/\/\*[\s\S]*?\*\//g, (m) => " ".repeat(m.length))
    .replace(/<!--[\s\S]*?-->/g, (m) => " ".repeat(m.length))
    .replace(/^[ \t]*\/\/.*$/gm, (m) => " ".repeat(m.length))
    .replace(/^[ \t]*\*.*$/gm, (m) => " ".repeat(m.length));

// Exact CSS hex lengths only, so in-page anchors (#deployment, #main) don't trip.
const HEX_RE =
  /(?<![\w-])#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})\b/g;

/** :root is a REGION exemption inside global.css, not a file exemption. */
function rootRegion(css) {
  const start = css.indexOf(":root {");
  if (start === -1) return null;
  let depth = 0;
  for (let i = start; i < css.length; i++) {
    if (css[i] === "{") depth++;
    else if (css[i] === "}") {
      depth--;
      if (depth === 0) return [start, i + 1];
    }
  }
  return null;
}

/* ── 1. Build & config ───────────────────────────────────────────────────── */

if (
  walk("src").some((f) => /tailwind\.config\./.test(f)) ||
  has("tailwind.config.js") ||
  has("tailwind.config.ts") ||
  has("tailwind.config.mjs")
) {
  fail(
    "no tailwind.config.*",
    "Tailwind v4 is CSS-first (§4). Delete it; config belongs in src/styles/global.css.",
  );
} else ok();

const wrangler = read("wrangler.jsonc");
if (/^\s*"(main|assets)"\s*:/m.test(wrangler)) {
  fail(
    "root wrangler.jsonc has no main/assets",
    "Declaring `main` here breaks astro build's cfvite plugin (§13). The adapter emits the real config to dist/server/wrangler.json.",
  );
} else ok();

const pkg = JSON.parse(read("package.json"));
for (const [name, want] of [
  ["preview", "--config ./dist/server/wrangler.json"],
  ["deploy", "--config ./dist/server/wrangler.json"],
]) {
  if (!pkg.scripts?.[name]?.includes(want)) {
    fail(
      `${name} script targets dist/server/wrangler.json`,
      `npm run ${name} must pass ${want} (§13).`,
    );
  } else ok();
}

/* ── 2. Routing / URL form (§2) ──────────────────────────────────────────── */

const astroConfig = read("astro.config.mjs");
if (!/trailingSlash:\s*"always"/.test(astroConfig)) {
  fail(
    'trailingSlash: "always"',
    "Set it in astro.config.mjs (§2). One URL form everywhere.",
  );
} else ok();

if (!has("src/pages/404.astro")) {
  fail(
    "404.astro exists",
    "Without it, unmatched URLs return Astro's unbranded framework 404 (§2).",
  );
} else ok();

const site = read("src/lib/site.ts");
const badPaths = [
  ...site.matchAll(/export const (\w*_PATH)\s*=\s*"([^"]*)"/g),
].filter(([, , v]) => v !== "/" && !v.endsWith("/"));
if (badPaths.length) {
  fail(
    "every *_PATH carries the trailing slash",
    `Bare: ${badPaths.map(([, k, v]) => `${k}="${v}"`).join(", ")}. Each costs a 307 on every click (§2).`,
  );
} else ok();

/* ── 3. Config comment marker (§12) ──────────────────────────────────────── */

const marker = astroConfig.match(/\/\/\s*pages:\s*(\d+);\s*ssr:\s*(\d+)/);
if (!marker) {
  fail(
    "astro.config.mjs carries a `// pages: N; ssr: N` marker",
    "Prose comments here have lied on both sites for months because nothing could check them (§12).",
  );
} else {
  // "pages" = routes that render a page (.astro). "ssr" = every route opting out
  // of prerender, endpoints included — that is the number people get wrong.
  const routeFiles = walk("src/pages").filter((f) => /\.(astro|ts)$/.test(f));
  const actualPages = routeFiles.filter((f) => f.endsWith(".astro")).length;
  const actualSsr = routeFiles.filter((f) =>
    /export const prerender = false/.test(read(f)),
  ).length;
  if (Number(marker[1]) !== actualPages || Number(marker[2]) !== actualSsr) {
    fail(
      "the `// pages:` marker matches the filesystem",
      `Marker says pages: ${marker[1]}; ssr: ${marker[2]} — actually pages: ${actualPages}; ssr: ${actualSsr}. Update the marker in the same commit as the route change (§12).`,
    );
  } else ok();
}

/* ── 4. Tokens & type (§4) ───────────────────────────────────────────────── */

const css = read("src/styles/global.css");
const cssScan = stripComments(css);

const FONT_BRIDGE = `  --font-display: var(--ff-display, "Space Grotesk", system-ui, sans-serif);
  --font-sans: var(--ff-body, "IBM Plex Sans", system-ui, sans-serif);
  --font-mono: var(--ff-mono, "IBM Plex Mono", ui-monospace, monospace);`;
if (!css.includes(FONT_BRIDGE)) {
  fail(
    "font bridge is byte-identical to §4",
    "It is fixed across every site — the size-adjusted fallbacks are what keep CLS near zero (§5).",
  );
} else ok();

if (!/:focus-visible\s*\{/.test(css)) {
  fail(":focus-visible ring present", "Required sitewide, never removed (§4).");
} else ok();

if (!/@media\s*\(prefers-reduced-motion:\s*reduce\)/.test(css)) {
  fail(
    "prefers-reduced-motion block present",
    "Must resolve all animation to its final state (§4).",
  );
} else ok();

if (
  !/\.skip-link/.test(css) ||
  !/id="main"/.test(read("src/layouts/Layout.astro"))
) {
  fail(
    "skip link targets #main",
    "First focusable element, visually hidden until focused (§6).",
  );
} else ok();

// @theme must contain no hex — only var(--x). That IS the two-layer contract.
const themeBlock = cssScan.match(/@theme\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";
const themeHex = themeBlock.match(HEX_RE);
if (themeHex) {
  fail(
    "@theme contains no hex",
    `Found ${themeHex.join(", ")}. @theme bridges :root, it does not define (§4).`,
  );
} else ok();

// :root is the oracle for every allowlisted hex.
const region = rootRegion(cssScan);
if (!region) {
  fail(":root block is parseable", "conform cannot verify tokens without it.");
} else {
  const rootHexes = new Set(
    (cssScan.slice(region[0], region[1]).match(HEX_RE) ?? []).map(normHex),
  );

  const allowed = new Map(HEX_ALLOWLIST.map((a) => [a.file, a.reason]));
  for (const { file, reason } of HEX_ALLOWLIST) {
    if (!reason || !reason.trim())
      fail(
        "every HEX_ALLOWLIST entry records a reason",
        `${file} has none. An exception nobody justified outlives its cause (§4).`,
      );
    else if (!has(file))
      fail(
        "HEX_ALLOWLIST entries exist",
        `${file} is listed but missing — delete the stale entry.`,
      );
    else ok();
  }

  const offenders = [];
  for (const f of walk("src").filter((f) => /\.(astro|ts|css)$/.test(f))) {
    const body = stripComments(read(f));
    let hits = [...body.matchAll(HEX_RE)];
    if (f === "src/styles/global.css") {
      hits = hits.filter((m) => m.index < region[0] || m.index >= region[1]);
    }
    if (!hits.length) continue;

    if (allowed.has(f)) {
      // Mirror assertion: allowed to contain hex, but only :root's hex.
      const stray = hits
        .map((m) => m[0])
        .filter((h) => !rootHexes.has(normHex(h)));
      if (stray.length) {
        fail(
          `${f} mirrors :root`,
          `${[...new Set(stray)].join(", ")} is not a :root token. This file is allowlisted (${allowed.get(f)}) but every hex in it must still be a value :root defines (§4).`,
        );
      } else ok();
    } else {
      offenders.push(
        `${f} (${[...new Set(hits.map((m) => m[0]))].slice(0, 4).join(", ")}${hits.length > 4 ? ", …" : ""})`,
      );
    }
  }
  if (offenders.length) {
    fail(
      "no hex literals outside :root",
      `${offenders.length} file(s):\n      ${offenders.join("\n      ")}\n    Put the color in :root and name it for its role (§4 rule 4).`,
    );
  } else ok();
}

// Brand-color rgba() is the same drift wearing different syntax (§4).
{
  const region2 = rootRegion(cssScan);
  const rootTriples = new Set();
  if (region2) {
    for (const h of (
      cssScan.slice(region2[0], region2[1]).match(HEX_RE) ?? []
    ).map(normHex)) {
      const x = h.slice(1);
      if (x.length === 6)
        rootTriples.add(
          `${parseInt(x.slice(0, 2), 16)},${parseInt(x.slice(2, 4), 16)},${parseInt(x.slice(4, 6), 16)}`,
        );
    }
  }
  const bad = [];
  for (const f of walk("src").filter((f) => /\.(astro|ts|css)$/.test(f))) {
    for (const m of stripComments(read(f)).matchAll(
      /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*[,)]/g,
    )) {
      const key = `${+m[1]},${+m[2]},${+m[3]}`;
      // White/black alphas carry no brand identity — out of scope per §4.
      if (key === "255,255,255" || key === "0,0,0") continue;
      if (rootTriples.has(key))
        bad.push(`${f}: ${m[0].replace(/[,)]$/, "")}…)`);
    }
  }
  if (bad.length) {
    const uniq = [...new Set(bad)];
    fail(
      "no brand-color rgba()",
      `${uniq.length} occurrence(s) duplicate a :root token, e.g.\n      ${uniq.slice(0, 4).join("\n      ")}\n    Use color-mix(in srgb, var(--token) N%, transparent) (§4).`,
    );
  } else ok();
}

/* ── 5. SEO (§8) ─────────────────────────────────────────────────────────── */

const baseHead = read("src/components/BaseHead.astro");
if (/image = "\/og-default\.svg"/.test(baseHead)) {
  fail(
    "BaseHead does not default to an SVG OG image",
    "Most social scrapers will not rasterize SVG (§8). Default to /og-default.png.",
  );
} else ok();

if (!has("public/og-default.png")) {
  fail(
    "public/og-default.png exists",
    "1200×630. Export recipe in §8 — and rasterize with the site's own fonts, system fonts disabled.",
  );
} else ok();

if (!/application\/ld\+json/.test(baseHead)) {
  fail("JSON-LD present in BaseHead", "Organization + WebSite sitewide (§8).");
} else ok();

const robots = read("public/robots.txt");
if (!/Sitemap:/i.test(robots)) {
  fail("robots.txt references the sitemap", "(§8)");
} else ok();
if (!/Disallow:\s*\/api\//.test(robots)) {
  fail(
    "robots.txt disallows /api/",
    "The form endpoint should not be crawled (§8).",
  );
} else ok();

/* ── 6. Security headers (§10) ───────────────────────────────────────────── */

if (!has("public/_headers")) {
  fail("public/_headers exists", "(§10)");
} else if (read("public/_headers") !== renderHeaders()) {
  fail(
    "public/_headers matches src/lib/securityHeaders.ts",
    "It is stale. Run `npm run headers`. The file covers static assets and the middleware covers SSR routes — if they disagree, only one of them is tested (§10).",
  );
} else ok();

if (/script-src[^;]*'unsafe-inline'/.test(read("public/_headers"))) {
  fail(
    "script-src has no 'unsafe-inline'",
    "It is load-bearing: it turns the scoped-script convention into an enforced invariant (§10).",
  );
} else ok();

if (!has("src/middleware.ts")) {
  fail(
    "src/middleware.ts exists",
    "_headers does not cover prerender=false routes — the form page would ship with no CSP (§10).",
  );
} else ok();

/* ── 6b. The CSP must not block our own scripts (§10) ────────────────────────
 * This is the check that was missing when the strict CSP first shipped, and its
 * absence cost real breakage: `curl -sI` proved the *header* was present, which
 * is not the same as proving the *page still works* under it. Astro inlines any
 * script chunk under `vite.build.assetsInlineLimit` (default 4096), and
 * `script-src 'self'` blocks inline scripts — so the pages shipped with their
 * nav and scroll-reveal dead, and [data-reveal] stuck at opacity:0. The
 * <noscript> fail-safe does not cover it: JS was enabled, just blocked.
 *
 * Reads the BUILT output, so it only means something after `astro build` — which
 * is why the CI order is check && conform && build, then this on the next run.
 * Skipped silently when dist/ is absent rather than passing falsely.
 */
if (!has("dist/client")) {
  console.warn(
    "  ~ skipped: inline-script check needs a build first (run `npm run build`)",
  );
} else {
  const pages = walk("dist/client").filter((f) => f.endsWith(".html"));
  const offenders = [];
  for (const f of pages) {
    const html = read(f);
    for (const m of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
      const [, attrs, body] = m;
      if (/\bsrc=/.test(attrs)) continue; // external — satisfies 'self'
      if (/ld\+json/.test(attrs)) continue; // data block, script-src N/A
      if (!body.trim()) continue;
      offenders.push(`${f} (${body.trim().length} bytes)`);
    }
  }
  if (offenders.length) {
    fail(
      "no inline <script> in built HTML",
      `${offenders.length} would be blocked by script-src 'self':\n      ${offenders.slice(0, 5).join("\n      ")}\n    Set vite.build.assetsInlineLimit: 0 in astro.config.mjs (§10). Astro inlines chunks under the limit; a blocked script is silent and the <noscript> fail-safe does not cover it.`,
    );
  } else ok();

  if (!pages.length)
    fail(
      "built pages exist",
      "dist/client has no HTML — did the build succeed?",
    );
  else ok();
}

/* ── 7. Secrets (§9) ─────────────────────────────────────────────────────── */

const gitignore = has(".gitignore") ? read(".gitignore") : "";
if (!/^\.dev\.vars$/m.test(gitignore)) {
  fail(".dev.vars is gitignored", "Secrets never land in the repo (§9).");
} else ok();
if (!has(".dev.vars.example")) {
  fail(".dev.vars.example is committed", "(§9)");
} else ok();

/* ── Report ──────────────────────────────────────────────────────────────── */

if (failures.length === 0) {
  console.log(`conform: ${checks} checks passed`);
  process.exit(0);
}
console.error(`\nconform: ${failures.length} failure(s), ${checks} passed\n`);
for (const { check, detail } of failures) {
  console.error(`  ✗ ${check}`);
  console.error(`    ${detail}\n`);
}
process.exit(1);
