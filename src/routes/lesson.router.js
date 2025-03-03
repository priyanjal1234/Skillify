import express from 'express';
import isLoggedin from '../middlewares/isLoggedin.js';
import isInstructor from '../middlewares/isInstructor.js';
import {
  createLesson,
  getCourseLessons,
  getOneLesson,
  updateLesson,
} from '../controllers/lesson.controller.js';
import upload from '../config/multerConfig.js';
const router = express.Router();

router
  .route('/create-lesson')
  .post(isLoggedin, isInstructor, upload.single('lessonVideo'), createLesson);

router.route('/course/:courseId').get(isLoggedin, getCourseLessons);

router.route('/:lessonId').get(isLoggedin, getOneLesson);

router
  .route('/update/:lessonId')
  .put(isLoggedin, isInstructor, upload.single('lessonVideo'), updateLesson);

export default router;
