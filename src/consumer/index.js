/**
 * Runner script for AWS Spot Instances
 */

// Step 1: Get a message from SQS
console.log('TODO')

// Step 2: Do some processing
console.log('TODO')

// Step 3: Delete the message from SQS
console.log('TODO')

/*
const request = require('then-request')
const { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs')

exports.handler = async (event, context) => {
  console.log(`Event: ${JSON.stringify(event)}`)

  // Build the SQS client
  const client = new SQSClient({
    region: process.env.AWS_REGION
  })

  for (let i = 0; i < event.count; i++) {
  }

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
*/
