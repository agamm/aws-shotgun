import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

/**
 * Writes output to Amazon S3
 *
 * @param {import('@aws-sdk/types').Message} message The SQS message
 * @param {object} output The output to write
 * @return {void}
 */
export async function writeOutput(name, output) {
  // Build the S3 client
  const client = new S3Client({
    region: process.env.AWS_REGION
  })

  // Write to S3
  const s3Response = await client.send(
    new PutObjectCommand({
      Body: JSON.stringify(output),
      Bucket: process.env.S3_BUCKET_ARN.split(':::')[1],
      Key: `${name}.json`
    })
  )

  console.log(`S3 Response: ${JSON.stringify(s3Response)}`)
}
