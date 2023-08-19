locals {
  loader_function_zip = "loader.zip"
}

################################################################################
# Amazon VPC                                                                   #
################################################################################

# Get the current availability zones for this region.
data "aws_availability_zones" "available" {
  state = "available"

  # Ignore local zones.
  filter {
    name   = "opt-in-status"
    values = ["opt-in-not-required"]
  }
}

# Amazon VPC with DNS hostnames enabled.
resource "aws_vpc" "vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
}

# Subnet in each availability zone.
resource "aws_subnet" "public_subnet" {
  availability_zone       = data.aws_availability_zones.available.names[0]
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  vpc_id                  = aws_vpc.vpc.id
}

# Internet Gateway (IGW) for public subnets.
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.vpc.id
}

# Route table for public subnets.
resource "aws_route_table" "route_table" {
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
}

# Associate the route table with the public subnets.
resource "aws_route_table_association" "public_subnet_routes" {
  subnet_id      = aws_subnet.public_subnet.id
  route_table_id = aws_route_table.route_table.id
}

################################################################################
# AWS IAM Role - Loader                                                        #
################################################################################

# Amazon STS policy for the loader function.
data "aws_iam_policy_document" "loader_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

# AWS IAM role to attach to loader functions.
resource "aws_iam_role" "loader_role" {
  assume_role_policy = data.aws_iam_policy_document.loader_role.json
}

# Policy to attach to the loader role.
resource "aws_iam_role_policy_attachment" "loader_role" {
  role       = aws_iam_role.loader_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaSQSQueueExecutionRole"
}

################################################################################
# Amazon CloudWatch Logs - Loader                                              #
################################################################################

# CloudWatch Log group for the Lambda function.
resource "aws_cloudwatch_log_group" "loader_function" {
  name              = "/aws/lambda/loader_function"
  retention_in_days = 14
}

################################################################################
# AWS Lambda Function - Loader                                                 #
################################################################################

# Archive file for uploading to Lambda.
data "archive_file" "loader_function" {
  type             = "zip"
  source_file      = "${path.module}/../src/loader/index.js"
  output_file_mode = "0666"
  output_path      = "${path.module}/../${local.loader_function_zip}"
}

# The actual Lambda function.
resource "aws_lambda_function" "loader_function" {
  function_name    = "loader"
  role             = aws_iam_role.loader_role.arn
  runtime          = "nodejs18.x"
  filename         = "${path.module}/../${local.loader_function_zip}"
  handler          = "index.js"
  memory_size      = 128
  package_type     = "Zip"
  source_code_hash = data.archive_file.loader_function.output_base64sha256
  timeout          = 60
}

################################################################################
# Amazon SQS Queue                                                             #
################################################################################

# Queue for messages from the loader function.
resource "aws_sqs_queue" "message_queue" {
  name_prefix                = "messages"
  receive_wait_time_seconds  = 10
  sqs_managed_sse_enabled    = true
  visibility_timeout_seconds = 90
}

################################################################################
# Amazon EC2 Spot Instances                                                    #
################################################################################

# Latest Amazon Linux 2023 AMI for ARM64.
data "aws_ami" "al2023" {
  owners      = ["amazon"]
  most_recent = true

  filter {
    name   = "architecture"
    values = ["arm64"]
  }

  filter {
    name   = "name"
    values = ["al2023-ami-2023*"]
  }
}

resource "aws_spot_instance_request" "spot_instances" {
  # Spot Instance arguments
  spot_price                     = var.aws_spot_instance_bid_usd
  wait_for_fulfillment           = false
  instance_interruption_behavior = "terminate"

  # EC2 Instance arguments
  ami                         = data.aws_ami.al2023.id
  associate_public_ip_address = true
  iam_instance_profile        = var.aws_spot_instance_profile_arn
  instance_type               = var.aws_spot_instance_type
  subnet_id                   = aws_subnet.public_subnet.id
}

################################################################################
# Amazon S3 Bucket                                                             #
################################################################################
resource "aws_s3_bucket" "output" {
  bucket_prefix = "output"
}

resource "aws_s3_bucket_ownership_controls" "output_bucket_controls" {
  bucket = aws_s3_bucket.output.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "output_bucket_acl" {
  depends_on = [aws_s3_bucket_ownership_controls.output_bucket_controls]

  bucket = aws_s3_bucket.output.id
  acl    = "private"
}

resource "aws_s3_bucket_server_side_encryption_configuration" "output_bucket_sse" {
  bucket = aws_s3_bucket.output.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "aws:kms"
    }
  }
}
