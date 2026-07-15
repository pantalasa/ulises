terraform {
  required_version = ">= 1.10, < 2.0"
}

module "asset_bucket" {
  source  = "terraform-aws-modules/s3-bucket/aws"
  version = "5.14.1"

  bucket = "ulises-merchant-assets"
}
