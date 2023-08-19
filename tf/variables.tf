# Input variables let you customize aspects of Terraform modules without
# altering the module's own source code. This functionality allows you to share
# modules across different Terraform configurations, making your module
# composable and reusable.
# https://developer.hashicorp.com/terraform/language/values/variables

variable "aws_region" {
  description = "The AWS region to deploy to."
  type        = string
  default     = "us-east-1"
}

variable "aws_spot_instance_ami" {
  description = "The AMI to use for the spot instances."
  type        = string
  default     = "ami-08a52ddb321b32a8c"
}

variable "aws_spot_instance_bid_usd" {
  description = "The maximum bid price per hour for the spot instances."
  type        = string
  default     = "0.01"
}

variable "aws_spot_instance_profile_arn" {
  description = "The ARN of the IAM instance profile to attach to the spot instances."
  type        = string
}

variable "aws_spot_instance_type" {
  description = "The type of spot instance to launch."
  type        = string
  default     = "t1.micro"
}

variable "aws_spot_instance_max_count" {
  description = "The maximum number of spot instances to launch."
  type        = number
  default     = 1
}

variable "aws_sqs_batch_size" {
  description = "The maximum number of messages to send to the SQS queue at once."
  type        = number
  default     = 10
}
