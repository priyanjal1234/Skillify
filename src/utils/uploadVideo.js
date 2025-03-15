import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3Client from '../config/awsConfig.js';
import getVideoUrl from './serveVideo.js';

async function uploadVideo(file) {
  const fileKey = `videos/${Date.now()}_${file.originalname}`;
  const params = {
    Bucket: 'lms-videos-bucket-in-aws',
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const command = new PutObjectCommand(params);
    const response = await s3Client.send(command);

    let videoUrl = await getVideoUrl(fileKey);

    return {videoUrl};
  } catch (error) {
    console.error('Error uploading video:', error);
    throw error;
  }
}

export default uploadVideo;
