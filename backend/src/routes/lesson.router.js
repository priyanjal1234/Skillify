import express from 'express';
import isLoggedin from '../middlewares/isLoggedin.js';
import isInstructor from '../middlewares/isInstructor.js';
import multer from 'multer';
import {
  createLesson,
  deleteLesson,
  getCourseLessons,
  getOneLesson,
  updateLesson,
} from '../controllers/lesson.controller.js';
const upload = multer()
import asyncHandler from '../utils/asyncHandler.js';
const router = express.Router();

const storage = multer.memoryStorage();
const imageKitUpload = multer({ storage });

router
  .route('/create-lesson/:courseId')
  .post(
    isLoggedin,
    isInstructor,
    upload.single('lessonVideo'),
    asyncHandler(createLesson)
  );

router
  .route('/course/:courseId')
  .get(isLoggedin, asyncHandler(getCourseLessons));

router.route('/:lessonId').get(isLoggedin, asyncHandler(getOneLesson));

router
  .route('/update/:lessonId')
  .put(
    isLoggedin,
    isInstructor,
    imageKitUpload.single('lessonVideo'),
    asyncHandler(updateLesson)
  );

router
  .route('/delete/:lessonId/:courseId')
  .delete(isLoggedin, isInstructor, asyncHandler(deleteLesson));

export default router;
