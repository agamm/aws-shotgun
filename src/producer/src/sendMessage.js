const { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs')

/**
 * Sends a message to the SQS queue `count` times.
 *
 * @param {string} message The message to send
 * @param {number} count The number of times to send the message
 * @return {Promise<void>}
 */
exports.sendMessage = async (message, count) => {
  // Build the SQS client
  const client = new SQSClient({
    region: process.env.AWS_REGION
  })

  // Add the URL to the queue `count` times
  for (const c of Array(count).keys()) {
    console.log(`Sending message (${c + 1} of ${count}))`)

    const sqsResponse = await client.send(
      new SendMessageCommand({
        QueueUrl: process.env.MESSAGE_QUEUE_URL,
        MessageBody: message
      })
    )

    console.log(`SQS Response: ${JSON.stringify(sqsResponse)}`)
  }
}
