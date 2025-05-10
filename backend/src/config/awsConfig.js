import { S3Client } from '@aws-sdk/client-s3';
import { awsAccessKeyId, awsSecretAccessKey } from '../constants.js';

const s3Client = new S3Client({
  region: 'ap-south-1', 
  credentials: {
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey,
  },
});

export default s3Client
