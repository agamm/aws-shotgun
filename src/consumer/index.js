import { writeOutput } from '../utils/writeOutput.js'
import { fetchWithTimeout } from '../utils/consumer.js'

const FETCH_TIMEOUT = 10000;

/**
 * This script is an example of a handler function that sends an HTTP request to the url
 * and uploads the result to Amazon S3. You can change it to anything you want ;)
 *
 * @param {object} messages The SQS messages batch as an array with JSON objects
 * @return {void}
 */

export async function handler(messages) {
  try {
    // running multiple asynchronous tasks
    const responses = await Promise.allSettled(
      // mapping messages from producer to return promises array
      messages.map(async message => {
        const parsedMessage = JSON.parse(message.Body);
        const url = parsedMessage.url;
        const urlWithProtocol = url.startsWith("http") ? url : `http://${url}`;

        console.log("Handling url: ", urlWithProtocol);
        return await fetchWithTimeout(urlWithProtocol, FETCH_TIMEOUT);
      })
    )
    
    // handling aggregated results
    console.log("Responses are back!");
    const okResponses = responses
    .filter((res) => {
      if (res.status === "fulfilled") {
        console.log('Response OK from ', res.value.url);
        return res;
      }
      else { console.error(res.reason) }
    })
    .map(res => res.value);

    // upload to s3 bucket
    await writeOutput(okResponses);

  } catch (error) {
    console.error('An error occurred:', error)
  }
}