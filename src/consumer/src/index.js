import fetch from 'node-fetch'
import { writeOutput } from './writeOutput.js'

/**
 * This script is the handler that performs any manipulation of the message
 * before it is uploaded to Amazon S3. It must return the successfully processed
 * messages that should be deleted from the SQS queue.
 *
 * @param {import('@aws-sdk/types').Message[]} messages The SQS messages to process
 * @return {Promise<Message[]>} The processed SQS messages
 */
export async function handler(messages) {
  const processed = []

  for (const message of messages) {
    // Make the request
    const response = await fetch(message.Body)
    const body = await response.json()

    // (TODO) Add your processing logic here...

    // Write the response to S3
    await writeOutput(message, body)

    // Add to successfully processed messages
    processed.push(message)
  }

  return processed
}
