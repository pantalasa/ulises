terraform {
  required_version = ">= 1.10, < 2.0"
}

module "settlement_bucket" {
  source = "s3::https://bpl-gaia-infra-services-nonprod-terraform-modules.s3.eu-west-2.amazonaws.com/s3-bucket-0.0.42.zip"

  bucket_name  = "ulises-settlement-output"
  service_name = "settlement-job"
  owner        = "merchant-servicing"
  environment  = "dev"
}

output "bucket_name" {
  value = module.settlement_bucket.bucket_name
}
