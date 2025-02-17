import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'learnify-uploads', // Specify the folder in Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'], // Allowed file types
  },
});

const upload = multer({storage})

export default upload