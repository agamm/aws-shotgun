locals {
  producer_function_zip = "producer.zip"
}

###########
# AWS IAM #
###########

# Policy Document for STS Assume Role action.
data "aws_iam_policy_document" "producer_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

# Role w/ SQS execution policy.
resource "aws_iam_role" "producer_role" {
  assume_role_policy = data.aws_iam_policy_document.producer_role.json
  name_prefix        = "producer"

  managed_policy_arns = [
    "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
    "arn:aws:iam::aws:policy/AmazonSQSFullAccess"
  ]
}

##########################
# Amazon CloudWatch Logs #
##########################

# Log Group for function logs.
resource "aws_cloudwatch_log_group" "producer_function" {
  name              = "/aws/lambda/producer"
  retention_in_days = 14
}

##############
# AWS Lambda #
##############

# Install dependencies from package.json.
resource "null_resource" "producer_package" {
  triggers = {
    updated_at = timestamp()
  }

  provisioner "local-exec" {
    command     = "npm install"
    working_dir = "${path.module}/../src/producer"
  }
}

# Archive file for uploading to Lambda.
data "archive_file" "producer_function" {
  type        = "zip"
  source_dir  = "${path.module}/../src/producer"
  output_path = "${path.module}/../${local.producer_function_zip}"
}

# The AWS Lambda function.
resource "aws_lambda_function" "producer_function" {
  #ts:skip=AWS.LambdaFunction.LM.MEIDUM.0063 Only managed policies applied
  filename         = "${path.module}/../${local.producer_function_zip}"
  handler          = "src/index.handler"
  memory_size      = 128
  function_name    = "producer"
  package_type     = "Zip"
  role             = aws_iam_role.producer_role.arn
  runtime          = "nodejs18.x"
  source_code_hash = data.archive_file.producer_function.output_base64sha256
  timeout          = 60

  # Environment variable with SQS queue URL.
  environment {
    variables = {
      MESSAGE_QUEUE_URL = aws_sqs_queue.message_queue.url
    }
  }
}
