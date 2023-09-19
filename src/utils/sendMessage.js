import { SQSClient, SendMessageBatchCommand } from '@aws-sdk/client-sqs'

/**
 * Sends a message to the SQS queue `count` times.
 *
 * @param {object} messageBatch The message batch to send
 * @return {Promise<void>}
 */
export async function sendMessage(messageBatch) {
  // Build the SQS client
  const client = new SQSClient({
    region: process.env.AWS_REGION
  })

  const sqsResponse = await client.send(
    new SendMessageBatchCommand({
      QueueUrl: process.env.MESSAGE_QUEUE_URL,
      Entries: messageBatch
    })
  )

  console.log(`SQS Response: ${JSON.stringify(sqsResponse)}`)
}
