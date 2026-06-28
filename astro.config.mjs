// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// NOTE: www is the canonical host — the infra (infra/main.tf) 301s the apex →
// www, so canonical + sitemap URLs must use www to match the redirect target.
export default defineConfig({
  site: "https://www.findthisbin.com",
  output: "static", // all 3 pages prerender; the site has no SSR routes
  adapter: cloudflare({
    // Art is SVG/CSS — no astro:assets raster pipeline, so no IMAGES binding needed.
    imageService: "passthrough",
    // Prerender the static pages in Node (not workerd) — simpler + robust for a
    // static-first site with no runtime routes.
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
  },
});
