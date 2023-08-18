# Terraform configurations must declare which providers they require so that
# Terraform can install and use them. Additionally, some providers require
# configuration (like endpoint URLs or cloud regions) before they can be used.
# https://developer.hashicorp.com/terraform/language/providers

terraform {
  # Default to v1.5.5 or greater.
  required_version = ">=1.5.2"

  # Declare the required providers and their versions.
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

################################################################################
# AWS IAM Credentials should NOT be stored in your Terraform code! Instead,    #
# set the AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_REGION environment #
# variables before running Terraform.                                          #
################################################################################
provider "aws" {}
