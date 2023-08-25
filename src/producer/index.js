import { sendMessage } from '../utils/sendMessage.js'
import data from './urls.json' assert { type: 'json' }

/**
 * Producer script for AWS Lambda functions.
 *
 * @param {Object} event The event object
 * @param {Object} context The context object
 * @return {Object} The response object
 */
export async function handler(event, context) {
  // Send the urls to the SQS queue
  for (const url of data) {
    await sendMessage({ url: url })
  }

  // Return success response
  return {
    statusCode: 200,
    body: JSON.stringify('Request complete!')
  }
}
