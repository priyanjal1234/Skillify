async function getVideoUrl(key) {
  const url = `https://my-lms-bucket-in-the-world.s3.ap-south-1.amazonaws.com/${key}`;
  return url;
}

export default getVideoUrl;
