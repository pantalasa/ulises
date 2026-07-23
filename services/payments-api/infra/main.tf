terraform {
  required_version = ">= 1.10, < 2.0"
}

module "merchant_engagement_table" {
  source = "s3::https://bpl-gaia-infra-services-nonprod-terraform-modules.s3.eu-west-2.amazonaws.com/dynamodb-0.0.94.zip"

  table_name   = "MerchantEngagement"
  hash_key     = "pk"
  range_key    = "sk"
  service_name = "merchant-engagement-graph"
  owner        = "merchant-servicing"
  environment  = "dev"

  attributes = [
    { name = "pk", type = "S" },
    { name = "sk", type = "S" },
    { name = "salesTransferPk", type = "S" },
  ]

  global_secondary_indexes = [
    {
      name = "SalesByTransferIndex"
      key_schema = [
        { attribute_name = "salesTransferPk", key_type = "HASH" },
        { attribute_name = "sk", key_type = "RANGE" }
      ]
      projection_type = "ALL"
    }
  ]

  shared_access = [
    { service_name = "merchant-engagement-data-transformer", access_level = "read-write" }
  ]

  # Optional bypass — populated by the iam-policy-lint workflow via TF_VAR_*
  # to skip AWS data-source lookups at plan time. Null at apply time means
  # the module resolves these from AWS as before.
  account_id  = var.account_id
  role_name   = var.role_name
  kms_key_arn = var.kms_key_arn
}

output "dynamodb_table_name" {
  value = module.merchant_engagement_table.table_name
}

output "dynamodb_table_arn" {
  value = module.merchant_engagement_table.table_arn
}
