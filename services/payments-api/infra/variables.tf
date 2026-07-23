variable "account_id" {
  description = "AWS account ID. Optional bypass consumed by the module to skip live AWS data lookups at plan time."
  type        = string
  default     = null
}

variable "role_name" {
  description = "IAM role name. Optional bypass consumed by the module to skip live AWS data lookups at plan time."
  type        = string
  default     = null
}

variable "kms_key_arn" {
  description = "KMS key ARN. Optional bypass consumed by the module to skip live AWS data lookups at plan time."
  type        = string
  default     = null
}
