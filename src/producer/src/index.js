const { sendMessage } = require('./sendMessage')

/**
 * Producer script for AWS Lambda functions.
 *
 * @param {Object} event The event object
 * @param {Object} context The context object
 * @return {Object} The response object
 */
exports.handler = async (event, context) => {
  console.log(`Event: ${JSON.stringify(event)}`)

  // Send the message to the SQS queue
  await sendMessage(event.url, event.count)

  // Return success response
  return {
    statusCode: 200,
    body: JSON.stringify('Request complete!')
  }
}
