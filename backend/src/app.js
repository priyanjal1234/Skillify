import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import http from 'http';
import { Server } from 'socket.io';

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      'https://skillify-frontend-prod.vercel.app',
      'https://skillify-admin-dashboard.vercel.app',
    ],
    credentials: true,
  },
});

import errorHandler from './utils/errorHandler.js';

import chatModel from './models/chat.model.js';

// Route Imports
import userRouter from './routes/user.router.js';
import courseRouter from './routes/course.router.js';
import orderRouter from './routes/order.router.js';
import analyticsRouter from './routes/analytics.router.js';
import lessonRouter from './routes/lesson.router.js';
import enrollmentRouter from './routes/enrollment.router.js';
import quizRouter from './routes/quiz.router.js';
import chatRouter from './routes/chat.router.js';
import notificationRouter from './routes/notification.router.js';
import resourceRouter from './routes/resource.router.js';
import adminRouter from './routes/admin.router.js';

import getBotResponse from './utils/getBotResponse.js';
import codeRouter from './routes/code.router.js';
import notificationModel from './models/notification.model.js';
import userModel from './models/user.model.js';

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      'https://skillify-frontend-prod.vercel.app',
      'https://skillify-admin-dashboard.vercel.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
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

// Socket Io Code
io.on('connection', function (socket) {
  console.log(`Connected ${socket.id}`);

  socket.on('join-room', function (roomId) {
    socket.join(roomId);
    io.to(roomId).emit('room-joined', roomId);
  });

  socket.on('send-message', async function (data) {
    try {
      let chat = await chatModel.findOne({ room: data.room });
      if (!chat) {
        chat = await chatModel.create({
          room: data.room,
          sender: data.senderId,
          receiver: data.receiverId,
        });
      }

      const messageObj = {
        content: data.message,
        isRead: false,
        createdAt: new Date(),
      };

      chat.messages.push(messageObj);
      await chat.save();

      io.emit('new-message', {
        ...messageObj,
        sender: data.senderId,
      });
    } catch (error) {
      socket.emit(
        'error',
        error instanceof Error ? error.message : 'Error creating chat'
      );
    }
  });

  socket.on('student-message', async function (data) {
    const botResponse = await getBotResponse(data);

    socket.emit('bot-reply', botResponse);
  });

  socket.on('go-live', async function (data) {
    try {
      let instructor = await userModel.findOne({ _id: data.instructorId });
      await notificationModel.create({
        user: data.instructorId,
        type: 'announcement',
        message: `${instructor.name} has started live. Ask For Invitaion`,
      });
    } catch (error) {
      socket.emit(
        'live-error',
        error instanceof Error ? error.message : 'Error going live'
      );
    }
  });

  socket.on('disconnect', function () {
    console.log(`Disconnected ${socket.id}`);
  });
});

app.use('/api/users', userRouter);

app.use('/api/courses', courseRouter);

app.use('/api/orders', orderRouter);

app.use('/api/analytics', analyticsRouter);

app.use('/api/lessons', lessonRouter);

app.use('/api/enrollments', enrollmentRouter);

app.use('/api/quiz', quizRouter);

app.use('/api/chats', chatRouter);

app.use('/api/code', codeRouter);

app.use('/api/notifications', notificationRouter);

app.use('/api/resources', resourceRouter);

app.use('/api/admin', adminRouter);

app.use(errorHandler);

export default server;
