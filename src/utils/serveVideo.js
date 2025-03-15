import { GetObjectCommand } from '@aws-sdk/client-s3';
import s3Client from '../config/awsConfig.js';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

async function getVideoUrl(key) {
  const params = {
    Bucket: 'lms-videos-bucket-in-aws',
    Key: key,
    Expires: 3600, 
  };

  try {
    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return url;
  } catch (error) {
    console.error('Error generating URL:', error);
    throw error;
  }
}

export default getVideoUrl
