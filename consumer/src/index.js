const request = require('then-request')
const { deleteMessage } = require('./deleteMessage')
const { getMessage } = require('./getMessage')
const { writeOutput } = require('./writeOutput')

/**
 * Consumer script for Amazon EC2 Spot Instances.
 *
 * @return {Object} The response object
 */
function handler() {
  // Get a message from SQS
  const message = getMessage()

  if (message === undefined) {
    return
  }

  // Make the request
  request('GET', message.body).done((httpResponse) => {
    console.log(`HTTP Response: ${JSON.stringify(httpResponse)}`)

    // Get the response body
    const body = httpResponse.getBody('utf-8')

    // (Optional) Do some processing

    // Write the response to S3
    writeOutput(message, body)

    // Delete the message from SQS
    deleteMessage(message)
  })
}

while (true) {
  handler()
}
