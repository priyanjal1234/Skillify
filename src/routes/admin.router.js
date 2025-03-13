import express from 'express';
import isLoggedin from '../middlewares/isLoggedin.js';
import isAdmin from '../middlewares/isAdmin.js';
import {
  deleteInstructor,
  deleteStudent,
  getCourseEnrollmentAnalytics,
  getCourseRatingsAnalytics,
  getDashboardDetails,
  getInstructorDetails,
  getOrderStatusAnalytics,
  getRevenueAnalytics,
  getStudentDetails,
  getUserRegisterationAnalytics,
  getUserRolesAnalytics,
} from '../controllers/admin.controller.js';
import asyncHandler from '../utils/asyncHandler.js';
const router = express.Router();

router
  .route('/get-dashboard-details')
  .get(isLoggedin, isAdmin, asyncHandler(getDashboardDetails));

router
  .route('/get-student-details')
  .get(isLoggedin, isAdmin, asyncHandler(getStudentDetails));

router
  .route('/get-instructor-details')
  .get(isLoggedin, isAdmin, asyncHandler(getInstructorDetails));

router
  .route('/delete-student/:studentId')
  .delete(isLoggedin, isAdmin, asyncHandler(deleteStudent));

router
  .route('/delete-instructor/:instructorId')
  .delete(isLoggedin, isAdmin, deleteInstructor);

router.route("/analytics/users/registrations").get(isLoggedin,isAdmin,getUserRegisterationAnalytics)

router.route("/analytics/user/roles").get(isLoggedin,isAdmin,getUserRolesAnalytics)

router.route("/analytics/course/enrollments").get(isLoggedin,isAdmin,getCourseEnrollmentAnalytics)

router.route("/analytics/course/ratings").get(isLoggedin,isAdmin,getCourseRatingsAnalytics)

router.route("/analytics/orders/revenue").get(isLoggedin,isAdmin,getRevenueAnalytics)

router.route("/analytics/orders/status").get(isLoggedin,isAdmin,getOrderStatusAnalytics)

export default router;
