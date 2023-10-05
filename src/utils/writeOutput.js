import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import uniqid from 'uniqid'

/**
 * Writes output to Amazon S3
 *
 * @param {object[]} outputs The output to write
 * @return {void}
 */
export async function writeOutput(outputs) {
  // Build the S3 client
  const client = new S3Client({
    region: process.env.AWS_REGION
  })

  // Write to S3
  const s3Responses = await Promise.allSettled(
    outputs.map(async (output) => {
      return await client.send(
        new PutObjectCommand({
          Body: JSON.stringify(output),
          Bucket: process.env.S3_BUCKET_ARN.split(':::')[1],
          Key: `${uniqid()}.json`
        })
      )
    })
  )
  s3Responses.map((res) => {
    if (res.status === 'fulfilled') {
      console.log(`S3 Response: `, res.value)
    } else {
      console.error(res.reason)
    }
  })
}

function urlToFileString(url) {
  return new URL(url).host.replace(/\./g, '_')
}
