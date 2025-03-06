import express from 'express';
import isLoggedin from '../middlewares/isLoggedin.js';
import isInstructor from '../middlewares/isInstructor.js';
import multer from 'multer';
import {
  changeLessonStatus,
  createLesson,
  deleteLesson,
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
  .put(isLoggedin, isInstructor, imageKitUpload.single('lessonVideo'), updateLesson);

router.route("/delete/:lessonId/:courseId").delete(isLoggedin,isInstructor,deleteLesson)

router.route("/change-status/:lessonId").put(isLoggedin,changeLessonStatus)

export default router;
