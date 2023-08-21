const {
  SQSClient,
  DeleteMessageCommand,
  Message
} = require('@aws-sdk/client-sqs')

/**
 * Deletes a message from the SQS queue
 *
 * @param {Message} message The SQS message
 * @return {void}
 */
exports.deleteMessage = (message) => {
  // Build the SQS client
  const client = new SQSClient({
    region: process.env.AWS_REGION
  })

  client
    .send(
      new DeleteMessageCommand({
        QueueUrl: process.env.SQS_QUEUE_URL,
        ReceiptHandle: message.ReceiptHandle
      })
    )
    .then((sqsResponse) => {
      console.log(`SQS Response: ${JSON.stringify(sqsResponse)}`)
    })
}
