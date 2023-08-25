import fetch from 'node-fetch'

/**
 * This script is the handler that performs any manipulation of the message
 * before it is uploaded to Amazon S3. It must return the string data that will
 * be written to the S3 bucket.
 *
 * @param {import('@aws-sdk/types').Message} message The SQS message to process
 * @return {string} The processed data to write to S3
 */
export async function handler(message) {
  // Make the request
  const response = await fetch(message.url)

  // Get the response body as JSON
  const body = await response.json()

  // (TODO) Add your processing logic here...

  // Return the output that will be written to S3
  return JSON.stringify(body)
}
