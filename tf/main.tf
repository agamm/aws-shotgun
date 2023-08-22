#############
# Amazon S3 #
#############

# Output bucket.
# This is not destroyed on cleanup!
resource "aws_s3_bucket" "output" {
  bucket_prefix = "output"
}

# Ownership controls for output bucket.
resource "aws_s3_bucket_ownership_controls" "output_bucket_controls" {
  bucket = aws_s3_bucket.output.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

# ACL for output bucket.
resource "aws_s3_bucket_acl" "output_bucket_acl" {
  depends_on = [aws_s3_bucket_ownership_controls.output_bucket_controls]

  bucket = aws_s3_bucket.output.id
  acl    = "private"
}

# Server-side encryption for output bucket.
resource "aws_s3_bucket_server_side_encryption_configuration" "output_bucket_sse" {
  bucket = aws_s3_bucket.output.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "aws:kms"
    }
  }
}
