# Intentional demo — this raw resource block is forbidden by bpl-terraform.no-raw-resources.
# All infra must go through curated modules from the approved artifact store.

resource "aws_sqs_queue" "settlement_deadletter" {
  name                      = "settlement-job-deadletter"
  message_retention_seconds = 1209600
}
