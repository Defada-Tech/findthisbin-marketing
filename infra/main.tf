# FindThisBIN marketing — Infrastructure as Code (Terraform / OpenTofu)
#
# SCOPE (read this first):
#   Terraform owns ONLY the long-lived account infrastructure:
#     • the Worker custom domain attachment (apex + www), which Cloudflare
#       auto-wires to DNS + TLS for the deployed Worker.
#     • the zone's "Always Use HTTPS" setting (http → https).
#     • a Single Redirect rule sending the apex → www (www is canonical).
#   Terraform does NOT own the Worker script, its assets, or its bindings —
#   those are deployed by `wrangler deploy` / Workers Builds from wrangler.jsonc.
#   Declaring a cloudflare_workers_script here would fight every deploy.
#
#   This site has no runtime secrets. If any are added later, set them with
#   `wrangler secret put <NAME>` — never in Terraform (state stores plaintext).
#
# AUTH: the provider reads the CLOUDFLARE_API_TOKEN environment variable — do
#   not put the token in a .tf or .tfvars file. Use a scoped token with, on the
#   target zone/account: Workers Scripts:Edit, Zone:Read, Zone:DNS:Edit,
#   Zone Settings:Edit (always_use_https), Dynamic Redirect:Edit (the
#   apex→www ruleset), and Account Settings:Read + Account Settings:Write
#   (the Web Analytics site).
#
# USAGE:
#   export CLOUDFLARE_API_TOKEN=...      # scoped token, never committed
#   export AWS_ACCESS_KEY_ID=...         # B2 keyID        (remote-state creds)
#   export AWS_SECRET_ACCESS_KEY=...     # B2 applicationKey
#   cd infra
#   cp backend.hcl.example backend.hcl   # then adjust bucket / key / region / endpoint
#   tofu init -backend-config=backend.hcl && tofu plan && tofu apply
#   (terraform works identically — swap `tofu` for `terraform`.)
#
# Version pins and the remote-state backend live in versions.tf; the backend's
# bucket/key/region/endpoint come from backend.hcl at init time.

# Token supplied via CLOUDFLARE_API_TOKEN env var (kept out of state).
provider "cloudflare" {}

# Attach the apex hostname to the deployed Worker. Cloudflare provisions the
# proxied DNS record + edge TLS certificate automatically for custom domains.
resource "cloudflare_workers_custom_domain" "apex" {
  account_id = var.cloudflare_account_id
  zone_id    = var.cloudflare_zone_id
  hostname   = var.domain
  service    = var.worker_name
}

# www → the canonical host. It is attached to the Worker so it serves the site
# directly, and the apex is 301'd here (see the redirect rule below). Set
# manage_www = false to skip — but then also disable redirect_apex_to_www, or
# the apex would redirect to a hostname nothing is serving.
#
# NOTE: with the apex→www redirect on, the in-app <link rel="canonical"> must
# also point at www. `site` in astro.config.mjs is "https://www.${var.domain}"
# so the canonical signal matches the 301 target.
resource "cloudflare_workers_custom_domain" "www" {
  count      = var.manage_www ? 1 : 0
  account_id = var.cloudflare_account_id
  zone_id    = var.cloudflare_zone_id
  hostname   = "www.${var.domain}"
  service    = var.worker_name
}

# Always Use HTTPS — Cloudflare replies to any http:// request on this zone with
# a 301 to the https:// equivalent, before the request reaches the Worker.
resource "cloudflare_zone_setting" "always_use_https" {
  count      = var.force_https ? 1 : 0
  zone_id    = var.cloudflare_zone_id
  setting_id = "always_use_https"
  value      = "on"
}

# Apex → www, 301, preserving path + query string. This Single Redirect runs in
# the request pipeline *before* Workers, so it fires even though the apex is
# attached as a Worker custom domain above.
# Cloudflare Web Analytics site for the www canonical host. The beacon is
# injected manually by the site (Analytics.astro) rather than via Cloudflare's
# auto_install, so the CSP is widened in the same commit. The site_token is
# read at build time via the CF_ANALYTICS_TOKEN env var.
resource "cloudflare_web_analytics_site" "findthisbin" {
  account_id  = var.cloudflare_account_id
  zone_tag    = var.cloudflare_zone_id
  auto_install = false
}

resource "cloudflare_ruleset" "redirect_apex_to_www" {
  count   = var.redirect_apex_to_www ? 1 : 0
  zone_id = var.cloudflare_zone_id
  name    = "Redirect apex to www"
  kind    = "zone"
  phase   = "http_request_dynamic_redirect"

  rules = [{
    ref         = "apex_to_www"
    description = "301 ${var.domain} → www.${var.domain}"
    expression  = "http.host eq \"${var.domain}\""
    action      = "redirect"
    action_parameters = {
      from_value = {
        status_code           = 301
        preserve_query_string = true
        target_url = {
          expression = "concat(\"https://www.${var.domain}\", http.request.uri.path)"
        }
      }
    }
  }]

  lifecycle {
    precondition {
      condition     = var.manage_www
      error_message = "redirect_apex_to_www requires manage_www = true (www must be attached to serve the redirect target)."
    }
  }
}
