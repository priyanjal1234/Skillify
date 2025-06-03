import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'learnify-uploads',
    resource_type: 'auto', 
    type: 'upload', 
    access_mode: 'public', 
  },
});

const upload = multer({ storage: storage });

export default upload;
