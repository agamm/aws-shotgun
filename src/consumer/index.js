import fetch from 'node-fetch'
import { writeOutput } from '../utils/writeOutput.js'

/**
 * This script is the handler that performs any manipulation of the message
 * before it is uploaded to Amazon S3. It must return the string data that will
 * be written to the S3 bucket.
 *
 * @param {object} message The SQS message body as a JSON object
 * @return {void}
 */
export async function handler(message) {
  try {
    // Make the request
    await timeout(200 * Math.random())
    const response = await fetch(`https://${message.url}`)

    // Write the output to S3
    if (response.ok) {
      await writeOutput(urlToFileString(message.url), message.url)
    }
  } catch (error) {
    console.error('An error occurred:', error)
  }
}

function urlToFileString(url) {
  let urlWithoutProtocol = url.replace('https://', '').replace('http://', '')
  let fileCompatibleString = urlWithoutProtocol
    .replace(/\//g, '-')
    .replace(/\./g, '_')
  return fileCompatibleString
}

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
