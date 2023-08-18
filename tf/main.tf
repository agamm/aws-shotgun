locals {
  tags = {
    Project = "upwork"
  }
}

# Create an Amazon SQS queue
# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sqs_queue
resource "aws_sqs_queue" "message_queue" {
  name_prefix                = "message-queue"
  receive_wait_time_seconds  = 10
  sqs_managed_sse_enabled    = true
  tags                       = local.tags
  visibility_timeout_seconds = 90
}
