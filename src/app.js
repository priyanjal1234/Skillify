import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';

const app = express();

import errorHandler from './utils/errorHandler.js';
import { corsOrigin } from './constants.js';

// Route Imports
import userRouter from './routes/user.router.js';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.SESSION_SECRET,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/users', userRouter);

app.use(errorHandler);

export default app;
