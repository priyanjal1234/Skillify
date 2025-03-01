import express from 'express';
import isLoggedin from '../middlewares/isLoggedin.js';
import isInstructor from '../middlewares/isInstructor.js';
import { getInstructorAnalytics } from '../controllers/analytics.controller.js';
const router = express.Router();

router
  .route('/dashboard/:instructorId')
  .get(isLoggedin, isInstructor, getInstructorAnalytics);

export default router;
