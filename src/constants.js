import dotenv from "dotenv";
dotenv.config();

export const corsOrigin = process.env.CORS_ORIGIN 

export const port = process.env.PORT || 4000

export const mongodbUri = process.env.MONGODB_URI 