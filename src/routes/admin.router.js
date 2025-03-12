import express from 'express';
import isLoggedin from '../middlewares/isLoggedin.js';
import isAdmin from '../middlewares/isAdmin.js';
import { deleteInstructor, deleteStudent, getDashboardDetails, getInstructorDetails, getStudentDetails } from '../controllers/admin.controller.js';
import asyncHandler from '../utils/asyncHandler.js';
const router = express.Router();

router
  .route('/get-dashboard-details')
  .get(isLoggedin, isAdmin, asyncHandler(getDashboardDetails));

router.route("/get-student-details").get(isLoggedin,isAdmin,asyncHandler(getStudentDetails))

router.route("/get-instructor-details").get(isLoggedin,isAdmin,asyncHandler(getInstructorDetails))

router.route("/delete-student/:studentId").delete(isLoggedin,isAdmin,asyncHandler(deleteStudent))

router.route("/delete-instructor/:instructorId").delete(isLoggedin,isAdmin,deleteInstructor)

export default router;
