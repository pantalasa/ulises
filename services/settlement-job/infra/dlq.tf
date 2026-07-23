# Scenario B — valid BPL-compliant module call:
# - source starts with the allowed prefix `s3::https://bpl-gaia-infra-`
# - artifact name pinned as `<name>-<X>.<Y>.<Z>.zip`
# Expected: Earthly Lunar passes; PR is mergeable.

module "settlement_dlq" {
  source = "s3::https://bpl-gaia-infra-services-nonprod-terraform-modules.s3.eu-west-2.amazonaws.com/sqs-0.0.12.zip"

  name                        = "settlement-job-dlq"
  message_retention_seconds   = 1209600
  visibility_timeout_seconds  = 30
}
