import express from 'express';
import isLoggedin from '../middlewares/isLoggedin.js';
import isInstructor from '../middlewares/isInstructor.js';
import { createResource } from '../controllers/resource.controller.js';
import upload from '../config/multerConfig.js';
import asyncHandler from '../utils/asyncHandler.js';
const router = express.Router();

router
  .route('/create-resource/:lessonId')
  .post(isLoggedin, isInstructor, upload.single("pdf") ,asyncHandler(createResource));

export default router;
