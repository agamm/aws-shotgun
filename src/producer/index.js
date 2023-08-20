const { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs')

/**
 * Producer script for AWS Lambda functions.
 *
 * @param {Object} event The event object
 * @param {Object} context The context object
 * @return {Object} The response object
 */
exports.handler = async (event, context) => {
  console.log(`Event: ${JSON.stringify(event)}`)

  // Build the SQS client
  const client = new SQSClient({
    region: process.env.AWS_REGION
  })

  // Add the URL to the queue `count` times
  for (const _ of Array(event.count).keys()) {
    const sqsResponse = await client.send(
      new SendMessageCommand({
        QueueUrl: process.env.MESSAGE_QUEUE_URL,
        MessageBody: event.url
      })
    )

    console.log(`SQS Response: ${JSON.stringify(sqsResponse)}`)
  }

  // Return success response
  return {
    statusCode: 200,
    body: JSON.stringify('Request complete!')
  }
}
