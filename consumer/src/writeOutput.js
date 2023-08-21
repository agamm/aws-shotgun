const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const { Message } = require('@aws-sdk/client-sqs')

/**
 * Writes output to Amazon S3
 *
 * @param {Message} message The SQS message
 * @param {string} output The output to write
 * @return {void}
 */
exports.writeOutput = (message, output) => {
  // Build the S3 client
  const client = new S3Client({
    region: process.env.AWS_REGION
  })

  client
    .send(
      new PutObjectCommand({
        ACL: 'private',
        Body: output,
        Bucket: process.env.S3_BUCKET_ARN.split(':::')[1],
        Key: `${message.MessageId}.json`
      })
    )
    .then((s3Response) => {
      console.log(`S3 Response: ${JSON.stringify(s3Response)}`)
    })
}
