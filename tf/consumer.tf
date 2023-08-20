# ###########
# # AWS IAM #
# ###########

# # IAM policy document for Spot Instances.
# data "aws_iam_policy_document" "consumer_role" {
#   statement {
#     effect = "Allow"

#     principals {
#       type        = "Service"
#       identifiers = ["ec2.amazonaws.com"]
#     }

#     actions = ["sts:AssumeRole"]
#   }
# }

# # IAM role for Spot Instances.
# resource "aws_iam_role" "consumer_role" {
#   assume_role_policy = data.aws_iam_policy_document.assume_role.json
#   name_prefix        = "consumer"
# }

# # Instance profile for Spot Instances.
# resource "aws_iam_instance_profile" "consumer_profile" {
#   name_prefix = "consumer"
#   role        = aws_iam_role.consumer_role.name
# }

# ##############
# # Amazon EC2 #
# ##############

# # Latest Amazon Linux 2023 AMI for ARM64.
# data "aws_ami" "amazon_linux_2023" {
#   owners      = ["amazon"]
#   most_recent = true

#   filter {
#     name   = "architecture"
#     values = ["arm64"]
#   }

#   filter {
#     name   = "name"
#     values = ["al2023-ami-2023*"]
#   }
# }

# # Amazon EC2 Spot Instance Request
# resource "aws_spot_instance_request" "spot_instances" {
#   # Spot Instance arguments
#   spot_price                     = var.aws_spot_instance_bid_usd
#   wait_for_fulfillment           = false
#   instance_interruption_behavior = "terminate"

#   # EC2 Instance arguments
#   ami                         = data.aws_ami.amazon_linux_2023.id
#   associate_public_ip_address = true
#   iam_instance_profile        = aws_iam_instance_profile.consumer_profile.arn
#   instance_type               = var.aws_spot_instance_type
#   subnet_id                   = aws_subnet.public_subnet.id
# }
