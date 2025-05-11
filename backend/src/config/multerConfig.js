import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let resourceType = 'image';

    if (file.mimetype === 'application/pdf') {
      resourceType = 'raw';
    } else if (file.mimetype.startsWith('video/')) {
      resourceType = 'video';
    }

    return {
      folder: 'learnify-uploads',
      resource_type: resourceType,
    };
  },
});

const upload = multer({ storage: storage });

export default upload;
