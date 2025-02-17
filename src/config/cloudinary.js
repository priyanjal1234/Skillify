import cloudinary from 'cloudinary';
cloudinary.v2;

import {
  cloudinaryApiKey,
  cloudinaryApiSecret,
  cloudName,
} from '../constants.js';

cloudinary.config({
  cloud_name: cloudName,
  api_key: cloudinaryApiKey,
  api_secret: cloudinaryApiSecret,
});

export default cloudinary