import { sendMessages } from '../utils/sendMessages.js'
import data from './urls.json' assert { type: 'json' }

/**
 * Producer script for AWS Lambda functions.
 *
 * @param {Object} event The event object
 * @param {Object} context The context object
 * @return {Object} The response object
 */
export async function handler(event, context) {
  // Send the messages to the SQS queue
  for (const item of data) {
    await sendMessages(item.url, item.count)
  }

  // Return success response
  return {
    statusCode: 200,
    body: JSON.stringify('Request complete!')
  }
}
