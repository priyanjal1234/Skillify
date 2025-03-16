async function getVideoUrl(key) {
  const url = `https://lms-videos-bucket-in-aws.s3.us-east-1.amazonaws.com/${key}`;
  return url;
}

export default getVideoUrl;
