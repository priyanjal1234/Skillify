import express from 'express';
import isLoggedin from '../middlewares/isLoggedin.js';
import isInstructor from '../middlewares/isInstructor.js';
import {
  changeCourseStatus,
  createCourse,
  deleteCourse,
  enrollInCourse,
  getAllCourses,
  getAverageRating,
  getInstructorCourses,
  getOneCourse,
  getPublishedCourses,
  rateCourse,
  unenrollFromCourse,
  updateCourse,
  validateCouponCode,
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

router.route('/:id/enroll').post(isLoggedin, asyncHandler(enrollInCourse));

router
  .route('/:instructorId/courses')
  .get(isLoggedin, isInstructor, asyncHandler(getInstructorCourses));

router
  .route('/change-course-status/:courseId')
  .post(isLoggedin, isInstructor, asyncHandler(changeCourseStatus));

router
  .route('/delete-course/:courseId')
  .delete(isLoggedin, isInstructor, asyncHandler(deleteCourse));

router
  .route('/edit-course/:courseId')
  .put(
    isLoggedin,
    isInstructor,
    upload.single('thumbnail'),
    asyncHandler(updateCourse)
  );

router.route('/published/all').get(asyncHandler(getPublishedCourses));

router
  .route('/:courseId/unenroll')
  .put(isLoggedin, asyncHandler(unenrollFromCourse));

router.route('/rate/:courseId').post(isLoggedin, asyncHandler(rateCourse));

router
  .route('/validate-couponCode/:courseId')
  .post(isLoggedin, asyncHandler(validateCouponCode));

router.route('/get-rating/:courseId').get(asyncHandler(getAverageRating));

export default router;
