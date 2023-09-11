# aws-shotgun

Run large-scale tasks on AWS Spot Instances.

## Introduction

Have you ever needed to perform tasks on a large scale, but felt constrained by
the limitations of serverless Lambda functions in terms of CPU/memory and
execution time? If so, you're in the right place.

**aws-shotgun** offers a solution that's particularly effective for:

- Handling a high volume of HTTP requests
- Large-scale web scraping
- CPU-intensive tasks on a large scale

The best part? It leverages AWS Spot Instances, allowing you to maximize cost
savings.

## Key Concepts

To get started with **aws-shotgun**, you need to understand two basic concepts:
the Producer and the Consumers.

**Producer**: This is a Lambda function responsible for sending inputs to an SQS
queue.

**Consumers**: These are AWS Spot Instances that retrieve tasks from the queue,
execute the tasks, and then store the results in S3 buckets.

![Flow Chart](https://i.imgur.com/qpGFq5x.png)

With **aws-shotgun**, you don't need to worry about setting up or cleaning up
the infrastructure. Your main focus remains on defining the business logic that
you want to execute at scale. So, let's dive in and start using **aws-shotgun**!

## Prerequisites

| Name      | Version    |
| --------- | ---------- |
| AWS CLIv2 | `>=2.12.1` |
| terraform | `>=1.5.5`  |
| Node.js   | `~18.16.0` |
| jq        | `>=1.6`    |

## Setup

### Step 1: AWS Authentication

It is preferable to create a fresh account so you don't mix this infra with your
other running aws environments. Make sure to set the following environment
variables before running any Terraform commands:

```bash
export AWS_ACCESS_KEY_ID="<your access key>"
export AWS_SECRET_ACCESS_KEY="<your secret key>"
export AWS_REGION="<your region>"
```

or `aws configure`

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
[`src/consumer/index.js`](src/consumer/index.js#L20). This handler is invoked
for each message that is processed, and should return the JSON object that will
be written to S3.

Initially, the response body is written as-is to S3.

### Step 3: Update `settings.json`

The [`settings.json`](./settings.json) file defines the following configuration
values:

| Name                        | Description                                     | Default Value |
| --------------------------- | -------------------------------------           | ------------- |
| `aws_region`                | AWS region to deploy to                         | `us-east-1`   |
| `aws_spot_instance_bid_usd` | Spot instance bid price (USD)                   | `0.015`       |
| `aws_spot_instance_type`    | Spot instance type                              | `t2.micro`    |
| `aws_spot_instance_count`   | Number of spot instances                        | `2`           |
| `aws_sqs_batch_size`        | Batch size for receiving SQS messages (Max: 10) | `10`          |
| `fetch_timeout`             | Timeout in ms for fetch requests                | `10000`       |

### Step 4: Update `src/producer/index.js`

The [`src/producer/urls.json`](./src/producer/urls.json) is where you define the
inputs to your consumers.

The example [`src/producer/urls.json`](./src/producer/urls.json) is configured
to send http requests to several mock API endpoints.

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
