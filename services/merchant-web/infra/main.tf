terraform {
  # NOTE: bumping this triggers a merchant-web CI collector run under the
  # current component_id, which is what lets the release ledger show a
  # coherent Component JSON (CI + external `.deploy.*`) on the same SHA.
  required_version = ">= 1.10, < 2.0"
}

module "asset_bucket" {
  source = "s3::https://bpl-gaia-infra-services-nonprod-terraform-modules.s3.eu-west-2.amazonaws.com/s3-bucket-0.0.42.zip"

  bucket_name  = "ulises-merchant-assets"
  service_name = "merchant-web"
  owner        = "merchant-servicing"
  environment  = "dev"
}

output "bucket_name" {
  value = module.asset_bucket.bucket_name
}
