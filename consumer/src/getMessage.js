const {
  SQSClient,
  ReceiveMessageCommand,
  Message
} = require('@aws-sdk/client-sqs')

/**
 * Gets a message from SQS
 *
 * @return {Message} The SQS response
 */
exports.getMessage = () => {
  // Build the SQS client
  const client = new SQSClient({
    region: process.env.AWS_REGION
  })

  // Poll SQS for a message
  client
    .send(
      new ReceiveMessageCommand({
        QueueUrl: process.env.SQS_QUEUE_URL,
        VisibilityTimeout: 30,
        WaitTimeSeconds: 20
      })
    )
    .then((sqsResponse) => {
      console.log(`SQS Response: ${JSON.stringify(sqsResponse)}`)

      // Return the message from the response
      return sqsResponse.Messages !== undefined
        ? sqsResponse.Messages[0]
        : undefined
    })
}
