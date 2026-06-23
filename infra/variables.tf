variable "cloudflare_account_id" {
  type        = string
  description = "Cloudflare account ID that owns the Worker and zone."
}

variable "cloudflare_zone_id" {
  type        = string
  description = "Zone ID for the site's domain."
}

variable "domain" {
  type        = string
  description = "Apex domain the site is served on (e.g. findthisbin.com)."
}

variable "worker_name" {
  type        = string
  description = "Deployed Worker service name (must match `name` in wrangler.jsonc)."
  default     = "findthisbin-marketing"
}

variable "manage_www" {
  type        = bool
  description = "Also attach www.<domain> to the Worker."
  default     = true
}

variable "force_https" {
  type        = bool
  description = "Enable the zone's 'Always Use HTTPS' setting (301s http:// → https://)."
  default     = true
}

variable "redirect_apex_to_www" {
  type        = bool
  description = "301 the apex domain to www.<domain> so www is the canonical host. Requires manage_www = true (www must be attached to serve the redirect target)."
  default     = true
}
