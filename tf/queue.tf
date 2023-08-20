##############
# Amazon SQS #
##############

# Queue for messages from the producer function.
resource "aws_sqs_queue" "message_queue" {
  name_prefix                = "messages"
  receive_wait_time_seconds  = 10
  sqs_managed_sse_enabled    = true
  visibility_timeout_seconds = 90
}
