# aws-shotgun

Run work at scale on AWS Spot Instances.

## Prerequisites

| Name      | Version    |
| --------- | ---------- |
| AWS CLIv2 | `>=2.12.1` |
| terraform | `>=1.5.5`  |
| Node.js   | `~18.16.0` |
| jq        | `>=1.6`    |

## Setup

### Step 1: AWS Authentication

Make sure to set the following environment variables before running any
Terraform commands:

```bash
export AWS_ACCESS_KEY_ID="<your access key>"
export AWS_SECRET_ACCESS_KEY="<your secret key>"
export AWS_REGION="<your region>"
```

Your AWS account must have permissions to create/update/destroy resources for
the following AWS services:

- Amazon EC2
- Amazon S3
- Amazon SQS
- Amazon VPC
- AWS Identity and Access Management (IAM)
- AWS Lambda

### Step 2: Update Message Handler

When the Amazon EC2 Spot Instances are launched, they will automatically start
polling SQS for messages. You can define custom processing for the response that
is received from the target endpoint by updating
[`src/consumer/index.js`](src/consumer/index.js#L20). By default, the response
body is written as-is to S3.

> [!NOTE]
>
> Make sure that your custom logic runs **before** the `writeOutput` function.

### Step 3: Update `settings.json`

The [`settings.json`](./settings.json) file defines the following configuration
values:

| Name                        | Description                           | Default Value |
| --------------------------- | ------------------------------------- | ------------- |
| `aws_region`                | AWS region to deploy to               | `us-east-1`   |
| `aws_spot_instance_bid_usd` | Spot instance bid price (USD)         | `0.015`       |
| `aws_spot_instance_type`    | Spot instance type                    | `t2.micro`    |
| `aws_spot_instance_count`   | Number of spot instances              | `2`           |
| `aws_sqs_batch_size`        | Batch size for receiving SQS messages | `10`          |

### Step 4: Update `urls.json`

The [`src/producer/urls.json`](./src/producer/urls.json) file defines the
endpoints that will be tested. The file must be updated with the endpoints you
want to test and the number of requests to send to each.

```json
[
  {
    "url": "<url to test>",
    "count": <number of requests to send>
  },
  {
    "url": "<url to test>",
    "count": <number of requests to send>
  }
]
```

The example [`src/producer/urls.json`](./src/producer/urls.json) is configured
to test the [Cat Facts API](https://github.com/alexwohlbruck/cat-facts).

### Step 5: Deploy

Run the following command to deploy the infrastructure:

```bash
script/start
```

Once complete, the Lambda function will populate the SQS queue with messages for
each of the endpoints to test. The Spot Instances will then poll the SQS queue
for messages and send requests to the endpoints. The responses will be written
to S3.

### Step 6: Status

You can check the current status of the process by running the following
command:

```bash
script/status
```

This will output the _approximate_ number of messages in the SQS queue and
objects in the S3 bucket.

```plain
Message count:      56
Object count:       44
```

### Step 7: Destroy

When the message count is `0` and the object count is stable, you can destroy
the infrastructure by running the following command:

```bash
script/stop
```

This will copy the output from the S3 bucket to the `output` directory and
destroy the infrastructure.

> [!NOTE]
>
> The S3 bucket is not deleted by default. You must delete the bucket manually
> after destroying the infrastructure.
