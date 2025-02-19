import express from 'express';
import {
  forgotPassword,
  getLoggedinUser,
  loginUser,
  logoutUser,
  registerUser,
  resendCode,
  resetPassword,
  updateLoggedinUser,
  verifyEmail,
} from '../controllers/user.controller.js';
import asyncHandler from '../utils/asyncHandler.js';
import isLoggedin from '../middlewares/isLoggedin.js';
import upload from '../config/multerConfig.js';
const router = express.Router();

router.route('/register').post(asyncHandler(registerUser));

router.route('/verify-email').post(asyncHandler(verifyEmail));

router.route("/resend-code").post(asyncHandler(resendCode))

router.route('/login').post(asyncHandler(loginUser));

router.route('/logout').get(logoutUser);

router.route('/profile').get(isLoggedin, asyncHandler(getLoggedinUser));

router
  .route('/update/profile')
  .put(
    isLoggedin,
    upload.single('profileImage'),
    asyncHandler(updateLoggedinUser)
  );

router.route('/forgot-password').post(asyncHandler(forgotPassword));

router.route('/reset-password/:token').post(asyncHandler(resetPassword));

export default router;
