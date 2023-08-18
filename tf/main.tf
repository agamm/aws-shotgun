locals {
  tags = {
    Project = "upwork"
  }
}

# Create an Amazon SQS queue
# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sqs_queue
resource "aws_sqs_queue" "message_queue" {
  name_prefix                = "message-queue"
  visibility_timeout_seconds = 90
  receive_wait_time_seconds  = 10
  tags                       = local.tags
}
