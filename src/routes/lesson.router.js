import express from 'express';
import isLoggedin from '../middlewares/isLoggedin.js';
import isInstructor from '../middlewares/isInstructor.js';
import multer from 'multer';
import {
  createLesson,
  getCourseLessons,
  getOneLesson,
  updateLesson,
} from '../controllers/lesson.controller.js';
import upload from '../config/multerConfig.js';
const router = express.Router();

const storage = multer.memoryStorage();
const imageKitUpload = multer({ storage });

router
  .route('/create-lesson/:courseId')
  .post(
    isLoggedin,
    isInstructor,
    imageKitUpload.single('lessonVideo'),
    createLesson
  );

router.route('/course/:courseId').get(isLoggedin, getCourseLessons);

router.route('/:lessonId').get(isLoggedin, getOneLesson);

router
  .route('/update/:lessonId')
  .put(isLoggedin, isInstructor, upload.single('lessonVideo'), updateLesson);

export default router;
