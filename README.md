# aws-shotgun

![GitHub Super-Linter](https://github.com/agamm/aws-shotgun/actions/workflows/super-linter.yml/badge.svg)
![Continuous Integration](https://github.com/agamm/aws-shotgun/actions/workflows/continuous-integration.yml/badge.svg)
![Coverage](./badges/coverage.svg)

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
