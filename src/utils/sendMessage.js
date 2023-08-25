import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs'

/**
 * Sends a message to the SQS queue `count` times.
 *
 * @param {string} message The message to send
 * @return {Promise<void>}
 */
export async function sendMessage(message) {
  // Build the SQS client
  const client = new SQSClient({
    region: process.env.AWS_REGION
  })

  const sqsResponse = await client.send(
    new SendMessageCommand({
      QueueUrl: process.env.MESSAGE_QUEUE_URL,
      MessageBody: message
    })
  )

  console.log(`SQS Response: ${JSON.stringify(sqsResponse)}`)
}
