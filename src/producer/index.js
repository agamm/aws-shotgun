const request = require('then-request')
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

  // Send the request
  const httpResponse = await request('GET', event.url)
  console.log(`HTTP Response: ${JSON.stringify(httpResponse)}`)

  const data = httpResponse.getBody()

  // Write the data to SQS
  const sqsResponse = await client.send(
    new SendMessageCommand({
      QueueUrl: process.env.MESSAGE_QUEUE_URL,
      MessageBody: data.toString()
    })
  )
  console.log(`SQS Response: ${JSON.stringify(sqsResponse)}`)

  // Return success response
  return {
    statusCode: 200,
    body: JSON.stringify('Request complete!')
  }
}
