// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { loadDevVars } from "./scripts/load-dev-vars.mjs";

const devVars = loadDevVars();
const cfAnalyticsToken = JSON.stringify(
  devVars.CF_ANALYTICS_TOKEN || process.env.CF_ANALYTICS_TOKEN || "",
);

// NOTE: www is the canonical host — the infra (infra/main.tf) 301s the apex →
// www, so canonical + sitemap URLs must use www to match the redirect target.
export default defineConfig({
  site: "https://www.findthisbin.com",
  // pages: 9; ssr: 2
  // ^ Machine-readable and checked by scripts/conform.mjs against the actual
  //   filesystem (§12). It replaced a prose comment that claimed "all 3 pages
  //   prerender; the site has no SSR routes" — wrong on both counts for months,
  //   because nothing could check it. The two on-demand routes are
  //   src/pages/api/contact.ts and src/pages/contact.astro.
  output: "static",
  // One URL form everywhere (§2): the slashed one. src/lib/site.ts spells every
  // *_PATH with the trailing slash to match, so internal links don't pay a 307.
  trailingSlash: "always",
  adapter: cloudflare({
    // Art is SVG/CSS — no astro:assets raster pipeline, so no IMAGES binding needed.
    imageService: "passthrough",
    // Prerender the static pages in Node (not workerd) — simpler + robust for a
    // static-first site. The two on-demand routes still run on workerd.
    prerenderEnvironment: "node",
  }),
  integrations: [sitemap()],
  // Self-hosted fonts (downloaded + cached at build) — no third-party Google
  // request at runtime, optimized size-adjusted fallbacks to minimize CLS.
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Space Grotesk",
      cssVariable: "--ff-display",
      weights: [500, 600, 700],
      subsets: ["latin"],
      fallbacks: ["system-ui", "sans-serif"],
    },
    {
      provider: fontProviders.google(),
      name: "IBM Plex Sans",
      cssVariable: "--ff-body",
      weights: [400, 500, 600, 700],
      subsets: ["latin"],
      fallbacks: ["system-ui", "sans-serif"],
    },
    {
      provider: fontProviders.google(),
      name: "IBM Plex Mono",
      cssVariable: "--ff-mono",
      weights: [400, 500],
      subsets: ["latin"],
      fallbacks: ["ui-monospace", "monospace"],
    },
  ],
  vite: {
    plugins: [tailwindcss()],
    define: {
      "import.meta.env.CF_ANALYTICS_TOKEN": cfAnalyticsToken,
    },
    build: {
      // LOAD-BEARING FOR THE CSP (§10). Do not raise this.
      //
      // Astro inlines any bundled <script> chunk smaller than
      // `build.assetsInlineLimit` (default 4096) straight into the HTML — see
      // astro/dist/core/build/plugins/plugin-scripts.js, which gates on
      // `shouldInlineAsset(code, file, assetsInlineLimit)`. Our scripts are
      // small, so they were being inlined.
      //
      // `script-src 'self'` with no 'unsafe-inline' then blocks them, and the
      // <noscript> fail-safe does NOT save us: it only applies when JS is
      // *disabled*, not when JS is enabled and the script is *blocked*. The
      // result was [data-reveal] stuck at opacity:0 — invisible content.
      //
      // It bit /company/ and /contact/ hardest here: pages with more client JS
      // bundled a chunk over the 4096 threshold and were externalized by luck,
      // so the breakage looked page-specific rather than systemic. It was
      // systemic.
      //
      // 0 disables inlining entirely (the check is `byteLength < limit`), so
      // every script is emitted as a file under /_astro/ and satisfies 'self'.
      // Verified by `npm run conform`, which fails on any inline <script> in the
      // built HTML.
      assetsInlineLimit: 0,
    },
  },
});
