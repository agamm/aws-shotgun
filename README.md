# aws-shotgun

Run work at scale on AWS Spot Instances.

## Prerequisites

| Name      | Version   |
| --------- | --------- |
| terraform | `1.5.5`   |
| Node.js   | `18.16.0` |

## AWS Authentication

Make sure to set the following environment variables before running any
Terraform commands:

```bash
export AWS_ACCESS_KEY_ID="anaccesskey"
export AWS_SECRET_ACCESS_KEY="asecretkey"
export AWS_REGION="us-west-2"
```
