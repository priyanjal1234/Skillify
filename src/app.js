import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { corsOrigin } from "./constants.js";

const app = express();

// Route Imports 
import userRouter from './routes/user.router.js'

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

export default app;
