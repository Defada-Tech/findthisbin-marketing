# Remote state — Backblaze B2 via the S3-compatible API.
#
# B2 speaks S3, so we use Tofu's built-in `s3` backend pointed at B2's
# endpoint, with every AWS-specific preflight check disabled (B2 is not AWS:
# no IAM account id, no EC2 metadata service, and its S3 API rejects the
# AWS SDK's newer checksum trailers — hence skip_s3_checksum).
#
# CREDENTIALS ARE NOT STORED HERE. The backend reads them from the standard
# AWS env vars; map the B2 key onto them before any `tofu init/plan/apply`:
#     export AWS_ACCESS_KEY_ID=<b2-keyID>
#     export AWS_SECRET_ACCESS_KEY=<b2-applicationKey>
# (Same secrecy rule as CLOUDFLARE_API_TOKEN — never commit the applicationKey.)
#
# FILL IN the three values marked CHANGE-ME to match the bucket you created,
# then run:  cd infra && tofu init -migrate-state
terraform {
  backend "s3" {
    bucket = "scaled-tfstates"                                      # your B2 bucket name
    key    = "findthisbin-marketing/terraform.tfstate"              # path of the state object inside the bucket
    region = "eu-central-003"                                       # your B2 bucket region

    endpoints = {
      s3 = "https://s3.eu-central-003.backblazeb2.com"              # https://s3.<region>.backblazeb2.com
    }

    # B2 is S3-compatible but not AWS — turn off AWS-only behaviour.
    skip_credentials_validation = true
    skip_region_validation      = true
    skip_requesting_account_id  = true
    skip_metadata_api_check     = true
    skip_s3_checksum            = true   # critical for B2: it rejects AWS SDK checksum trailers
    use_path_style              = true
  }
}
