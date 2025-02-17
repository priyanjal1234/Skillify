import express from "express";
import cors from "cors";
import dotenv from 'dotenv'
dotenv.config()

import cookieParser from "cookie-parser";

const app = express();

// Route Imports 
import userRouter from './routes/user.router.js'
import errorHandler from "./utils/errorHandler.js";
import { corsOrigin } from "./constants.js";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);

app.use("/api/users",userRouter)

app.use(errorHandler)

export default app;
