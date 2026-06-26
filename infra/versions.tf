# Tofu/Terraform version + provider pins, and the remote-state backend.
#
# The backend is a PARTIAL configuration: the static B2-vs-AWS compatibility
# flags (skip_*/use_*) live here, while the "where" of the state
# (bucket/key/region/endpoint) is supplied at init time from backend.hcl:
#
#     cd infra && tofu init -backend-config=backend.hcl
#
# CREDENTIALS ARE NOT STORED IN GIT. The backend reads them from the standard
# AWS env vars; map the B2 key onto them before any `tofu init/plan/apply`:
#     export AWS_ACCESS_KEY_ID=<b2-keyID>
#     export AWS_SECRET_ACCESS_KEY=<b2-applicationKey>
# (Same secrecy rule as CLOUDFLARE_API_TOKEN — never commit the applicationKey.)

terraform {
  required_version = ">= 1.6"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5"
    }
  }

  # Remote state — Backblaze B2 via the S3-compatible API. B2 speaks S3, so we
  # use the built-in `s3` backend with every AWS-specific preflight disabled
  # (B2 has no IAM account id, no EC2 metadata service, and its S3 API rejects
  # the AWS SDK's newer checksum trailers — hence skip_s3_checksum).
  #
  # bucket/key/region/endpoints are intentionally omitted here — they come from
  # backend.hcl via `-backend-config` at init time.
  backend "s3" {
    skip_credentials_validation = true
    skip_region_validation      = true
    skip_requesting_account_id  = true
    skip_metadata_api_check     = true
    skip_s3_checksum            = true # critical for B2: it rejects AWS SDK checksum trailers
    use_path_style              = true
  }
}
