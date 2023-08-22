import { Consumer } from 'sqs-consumer'
import { SQSClient } from '@aws-sdk/client-sqs'
import { handler } from './index.js'

const app = Consumer.create({
  queueUrl: process.env.SQS_QUEUE_URL,
  batchSize: parseInt(process.env.SQS_BATCH_SIZE, 1),
  handleMessageBatch: handler,
  sqs: new SQSClient({
    region: process.env.AWS_REGION
  })
})

app.on('error', (err) => {
  console.error(err.message)
})

app.on('processing_error', (err) => {
  console.error(err.message)
})

app.start()
