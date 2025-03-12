import express from 'express';
import isLoggedin from '../middlewares/isLoggedin.js';
import isAdmin from '../middlewares/isAdmin.js';
import { deleteStudent, getDashboardDetails, getStudentDetails } from '../controllers/admin.controller.js';
import asyncHandler from '../utils/asyncHandler.js';
const router = express.Router();

router
  .route('/get-dashboard-details')
  .get(isLoggedin, isAdmin, asyncHandler(getDashboardDetails));

router.route("/get-student-details").get(isLoggedin,isAdmin,asyncHandler(getStudentDetails))

router.route("/delete-student/:studentId").delete(isLoggedin,isAdmin,deleteStudent)

export default router;
