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
import courseRouter from './routes/course.router.js'
import orderRouter from './routes/order.router.js'
import analyticsRouter from './routes/analytics.router.js'
import lessonRouter from './routes/lesson.router.js'
import enrollmentRouter from './routes/enrollment.router.js'

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

app.use("/api/courses",courseRouter)

app.use("/api/orders",orderRouter)

app.use("/api/analytics",analyticsRouter)

app.use("/api/lessons",lessonRouter)

app.use("/api/enrollments",enrollmentRouter)

app.use(errorHandler);

export default app;
