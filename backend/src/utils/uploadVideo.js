import {
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand
} from '@aws-sdk/client-s3';
import s3Client from '../config/awsConfig.js';
import getVideoUrl from './serveVideo.js';

async function uploadVideo(file) {
  const fileKey = `videos/${Date.now()}_${file.originalname}`;
  const bucket = 'my-lms-bucket-in-the-world';

  // Minimum part size is 5MB, except the last part
  const PART_SIZE = 5 * 1024 * 1024;
  const buffer = file.buffer;
  const numParts = Math.ceil(buffer.length / PART_SIZE);

  try {
    // 1. Initiate multipart upload
    const createCommand = new CreateMultipartUploadCommand({
      Bucket: bucket,
      Key: fileKey,
      ContentType: file.mimetype
    });

    const createRes = await s3Client.send(createCommand);
    const uploadId = createRes.UploadId;

    // 2. Upload parts
    const uploadedParts = [];

    for (let i = 0; i < numParts; i++) {
      const start = i * PART_SIZE;
      const end = Math.min(start + PART_SIZE, buffer.length);
      const partBuffer = buffer.slice(start, end);

      const uploadPartCommand = new UploadPartCommand({
        Bucket: bucket,
        Key: fileKey,
        PartNumber: i + 1,
        UploadId: uploadId,
        Body: partBuffer,
      });

      const partRes = await s3Client.send(uploadPartCommand);

      uploadedParts.push({
        ETag: partRes.ETag,
        PartNumber: i + 1,
      });
    }

    // 3. Complete multipart upload
    const completeCommand = new CompleteMultipartUploadCommand({
      Bucket: bucket,
      Key: fileKey,
      UploadId: uploadId,
      MultipartUpload: {
        Parts: uploadedParts
      }
    });

    await s3Client.send(completeCommand);

    // 4. Get video URL
    const videoUrl = await getVideoUrl(fileKey);
    return { videoUrl };

  } catch (error) {
    console.error('Error uploading video via multipart:', error);

    // Abort if failed
    if (uploadId) {
      await s3Client.send(new AbortMultipartUploadCommand({
        Bucket: bucket,
        Key: fileKey,
        UploadId: uploadId
      }));
    }

    throw error;
  }
}

export default uploadVideo;
