import dotenv from "dotenv";
dotenv.config();

export const corsOrigin = process.env.CORS_ORIGIN 

export const port = process.env.PORT || 4000

export const mongodbUri = process.env.MONGODB_URI 

export const jwtKey = process.env.JWT_KEY 

export const cloudName = process.env.CLOUDINARY_CLOUD_NAME

export const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY

export const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET