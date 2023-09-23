import { sendMessage } from '../utils/sendMessage.js'
import data from './urls.json' assert { type: 'json' }
import uniqid from 'uniqid';

/**
 * Producer script for AWS Lambda functions.
 *
 * @param {Object} event The event object
 * @param {Object} context The context object
 * @return {Object} The response object
 */
export async function handler(event, context) {
  // Sends 10 urls batches to the SQS queue for quicker performance
  let msgCounter = 0;
  for (let i = 0; i < data.length; i += 10) {
    const dataBatch = data.slice(i, i + 10);
    const urlsBatch = [];
    for (let j = 0; j < dataBatch.length; j++) {
      urlsBatch.push({
        MessageBody: JSON.stringify({url: dataBatch[j]}),
        Id: uniqid()
      })
    }

    await sendMessage(urlsBatch)
    msgCounter++;
  }

  // Return success response
  console.log(`Request complete! Sent ${msgCounter} message batches for ${data.length} urls.`)
  return {
    statusCode: 200,
    body: JSON.stringify('Request complete!')
  }
}
