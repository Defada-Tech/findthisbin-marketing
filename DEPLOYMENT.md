# Deployment runbook — FindThisBIN marketing site

Step-by-step guide to deploy this site to **Cloudflare Workers (Static Assets)**, attach a custom domain via **Terraform/OpenTofu**, and wire **Workers Builds** for continuous deployment (no GitHub Actions).

The README has the at-a-glance version; this is the full runbook with prerequisites, ordering, verification, and troubleshooting.

This site is **fully static** — all three pages prerender and there are no SSR routes or runtime secrets. That keeps deployment simple: there's no secret to set and nothing to exercise on the server.

---

## 0. Prerequisites (one-time)

- **Node 20+** and this repo installed (`npm install`).
- **Wrangler** is bundled (`npx wrangler …`); no global install needed.
- A **Cloudflare account**.
- Your **domain added to Cloudflare as a zone** — i.e. the domain's nameservers point to Cloudflare and the zone is **Active**. Terraform manages DNS records *inside* an existing zone; it does not register a domain or onboard a zone. (Skip if you'll only use the free `*.workers.dev` URL.)

### Find your IDs

```bash
npx wrangler whoami          # prints your Account ID
```

- **Account ID** — `wrangler whoami`, or dashboard → Workers & Pages (right sidebar).
- **Zone ID** — dashboard → select your domain → **Overview** → API section (bottom right).

> **Ordering matters.** The Worker must exist before Terraform can attach a custom domain to it, and before Workers Builds can deploy to it. Follow the steps in order: **build → auth → first deploy → custom domain (Terraform) → CD (Workers Builds)**.

---

## 1. Build and test locally

```bash
npm run check        # type-check (astro check) — expect 0 errors
npm run build        # → dist/client (static) + dist/server (Worker)
```

Optionally exercise the built Worker locally (closest to production):

```bash
npm run preview      # astro build && wrangler dev --config ./dist/server/wrangler.json
```

Visit the port wrangler prints (default http://localhost:8787) and click through `/`, `/pricing`, `/docs` — confirm the nav scroll/menu, BIN playground, code-language tabs, pricing toggle, and FAQ accordion all work.

---

## 2. Authenticate Wrangler

```bash
npx wrangler login        # opens a browser OAuth flow
```

For headless/CI use instead set `CLOUDFLARE_API_TOKEN` (a token with **Workers Scripts: Edit**). Workers Builds (step 4) handles its own auth — this is only for local/manual deploys.

---

## 3. First deploy (creates the Worker)

```bash
npm run deploy        # astro build && wrangler deploy --config ./dist/server/wrangler.json
```

This builds and uploads the Worker named **`findthisbin-marketing`** (per `wrangler.jsonc`) with its static assets. Wrangler prints a `https://findthisbin-marketing.<your-subdomain>.workers.dev` URL.

**Verify:**

```bash
# replace with your printed workers.dev URL
BASE=https://findthisbin-marketing.<subdomain>.workers.dev
curl -sI  $BASE/                  # 200
curl -sI  $BASE/pricing/          # 200
curl -sI  $BASE/docs/             # 200
curl -sI  $BASE/robots.txt        # 200
curl -sI  $BASE/sitemap-index.xml # 200
```

> **Why `--config ./dist/server/wrangler.json`?** The `@astrojs/cloudflare` adapter generates the real deploy config (with `main`/`assets`) into `dist/server/` at build time. The root `wrangler.jsonc` deliberately omits `main` (declaring it there breaks `astro build`).

---

## 4. Custom domain via Terraform / OpenTofu

> Requires step 3 first — Terraform attaches the domain to the **existing** Worker service.

```bash
export CLOUDFLARE_API_TOKEN=...      # scoped token — NEVER commit it / never in tfvars
cd infra
cp terraform.tfvars.example terraform.tfvars
#   cloudflare_account_id = "..."     (from step 0)
#   cloudflare_zone_id    = "..."
#   domain                = "findthisbin.com"
tofu init
tofu plan          # review — confirm resource/attribute names match your provider version
tofu apply
```

**API-token scopes** (least privilege) for the token in `CLOUDFLARE_API_TOKEN`:
- Account → **Workers Scripts: Edit** (attach custom domain to the Worker)
- Zone → **DNS: Edit** and **Zone: Read** (for the target zone)
- Zone → **Zone Settings: Edit** (for the `always_use_https` setting)
- Zone → **Dynamic Redirect: Edit** (for the apex→www Single Redirect ruleset)

Cloudflare auto-provisions the proxied DNS record + edge TLS certificate for the custom domain. Allow a few minutes for the certificate to issue, then:

```bash
curl -sI https://findthisbin.com/         # 301 → https://www.findthisbin.com/
curl -sI http://www.findthisbin.com/      # 301 → https://www.findthisbin.com/ (Always Use HTTPS)
curl -sI https://www.findthisbin.com/     # 200 over HTTPS (canonical host)
```

`infra/` manages the **custom-domain attachments, Always Use HTTPS, and the apex→www redirect** — never the Worker script (that would fight every deploy) and never secrets. Toggle any of it with `manage_www` / `force_https` / `redirect_apex_to_www` in `terraform.tfvars` (all default `true`).

---

## 5. Continuous deployment — Cloudflare Workers Builds (no GitHub Actions)

> Requires a Git remote:
> ```bash
> git remote add origin git@github.com:<you>/findthisbin-marketing.git
> git push -u origin main
> ```
> (Workers Builds supports GitHub and GitLab.)

In the Cloudflare dashboard → **Workers & Pages → `findthisbin-marketing` → Settings → Builds**:

1. **Connect** the GitHub/GitLab repository (one-time OAuth — this step cannot be provisioned by Terraform).
2. **Production branch:** `main`.
3. **Build command:** `npm run build`
4. **Deploy command:** `npx wrangler deploy --config ./dist/server/wrangler.json`

Every push to `main` now builds and deploys inside Cloudflare's infrastructure. Local `npm run deploy` still works for emergency hotfixes.

---

## Verification checklist

- [ ] All 3 routes return 200 (`/`, `/pricing`, `/docs`).
- [ ] `/robots.txt` and `/sitemap-index.xml` return 200.
- [ ] `www` serves over HTTPS (200); the apex 301s to `https://www.findthisbin.com`; any `http://` URL 301s to `https://`.
- [ ] Page canonical tags point at **`www`** (`site = "https://www.findthisbin.com"` in `astro.config.mjs`) so the canonical/sitemap match the redirect target.
- [ ] Interactions work in the browser: nav scroll-translucency + mobile menu, BIN playground, code-language tabs, pricing monthly/annual toggle, FAQ accordion. With JS disabled, content still renders (the hero JSON, the playground's default card, and all FAQ answers stay visible).

## Rollback

```bash
npx wrangler deployments list                    # find a previous version id
npx wrangler rollback [<version-id>]             # roll the Worker back
```

Or redeploy a known-good commit (re-run step 3, or push it for Workers Builds).

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| `astro build` crashes: **`require_dist is not a function`** | Vite was bumped to v8. Keep the `overrides: { "vite": "^7.3.5" }` pin in `package.json`. |
| `astro build` fails resolving **`main`** | A `main`/`assets` key was added to the **root** `wrangler.jsonc` — remove it; the adapter injects them into `dist/server/wrangler.json`. |
| Terraform: **Worker service not found** when attaching the domain | Run the first deploy (step 3) before `tofu apply`. |
| Custom domain **not serving / no TLS** | The zone must be Active on Cloudflare; allow a few minutes for the certificate to issue after `tofu apply`. |
| Fonts re-download on every build / slow build | The Astro Fonts API caches downloaded fonts; keep `.astro/` (the build cache) intact between builds. |
| Need to add a binding (e.g. KV/D1) | Edit `wrangler.jsonc`, run `npm run types` to refresh `worker-configuration.d.ts`, redeploy. |

## Cost

Every route is a static asset (there are no SSR routes), so requests are served from Cloudflare's edge cache and don't invoke the Worker — free and unlimited. Hosting is effectively **$0** for marketing traffic.
