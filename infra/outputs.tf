output "canonical_url" {
  description = "Primary site URL (www when the apex→www redirect is enabled)."
  value       = var.redirect_apex_to_www ? "https://www.${var.domain}" : "https://${var.domain}"
}

output "apex_url" {
  description = "Apex URL (301s to canonical_url when redirect_apex_to_www = true)."
  value       = "https://${var.domain}"
}

output "www_hostname" {
  description = "www hostname attached to the Worker (null when manage_www = false)."
  value       = var.manage_www ? "www.${var.domain}" : null
}

output "worker_service" {
  description = "Worker service the custom domains route to."
  value       = var.worker_name
}
