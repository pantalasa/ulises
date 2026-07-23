terraform {
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
