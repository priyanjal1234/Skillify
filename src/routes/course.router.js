import express from 'express';
import isLoggedin from '../middlewares/isLoggedin.js';
import isInstructor from '../middlewares/isInstructor.js';
import {
  changeCourseStatus,
  createCourse,
  deleteCourse,
  enrollInCourse,
  getAllCourses,
  getInstructorCourses,
  getOneCourse,
  getPublishedCourses,
  rateCourse,
  unenrollFromCourse,
  updateCourse,
} from '../controllers/course.controller.js';
import asyncHandler from '../utils/asyncHandler.js';
import upload from '../config/multerConfig.js';

const router = express.Router();

router
  .route('/create-course')
  .post(
    isLoggedin,
    isInstructor,
    upload.single('thumbnail'),
    asyncHandler(createCourse)
  );

router.route('/all').get(asyncHandler(getAllCourses));

router.route('/course/:id').get(isLoggedin, asyncHandler(getOneCourse));

router.route('/:id/enroll').post(isLoggedin, enrollInCourse);

router.route('/:instructorId/courses').get(isLoggedin,isInstructor, getInstructorCourses);

router.route("/change-course-status/:courseId").post(isLoggedin,isInstructor,changeCourseStatus)

router.route("/delete-course/:courseId").delete(isLoggedin,isInstructor,deleteCourse)

router.route("/edit-course/:courseId").put(isLoggedin,isInstructor,upload.single("thumbnail"),updateCourse)

router.route("/published/all").get(getPublishedCourses)

router.route("/:courseId/unenroll").put(isLoggedin,unenrollFromCourse)

router.route("/rate/:courseId").post(isLoggedin,rateCourse)

export default router;
