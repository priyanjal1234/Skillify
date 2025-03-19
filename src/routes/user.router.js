import express from 'express';
import {
  calculateProgress,
  completeLessons,
  forgotPassword,
verifyOTP,
  getCompletedLessons,
  getInstructors,
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
import passport from 'passport';
import jwt from 'jsonwebtoken';
import '../config/passport.js';

const router = express.Router();

router.route('/register').post(asyncHandler(registerUser));

router.route('/verify-email').post(asyncHandler(verifyEmail));

router.route('/resend-code').post(asyncHandler(resendCode));

router.route('/login').post(asyncHandler(loginUser));

router.route('/logout').get(logoutUser);

router.route('/profile').get(isLoggedin, asyncHandler(getLoggedinUser));

router.route('/update/profile').put(
  isLoggedin,

  upload.single('profilePicture'),
  asyncHandler(updateLoggedinUser)
);

router.route('/forgot-password').post(asyncHandler(forgotPassword));

router.route('/validate-reset-otp').post(asyncHandler(verifyOTP))

router.route('/reset-password').post(asyncHandler(resetPassword));

router
  .route('/google')
  .get(passport.authenticate('google', { scope: ['profile', 'email'] }));

router.route('/auth/google/callback').get(
  passport.authenticate('google', {
    failureRedirect:
      'https://skillify-frontend-iota.vercel.app/login/student?error=google_login_failed',
  }),
  async function (req, res) {
    try {
      if (!req.user) {
        return res.redirect(
          'https://skillify-frontend-iota.vercel.app/login/student?error=auth_failed'
        );
      }

      const token = jwt.sign(
        { id: req.user._id, name: req.user.name, email: req.user.email },
        process.env.JWT_KEY,
        {
          expiresIn: '7d',
        }
      );

      res.cookie('token', token,{httpOnly: true,secure: true, sameSite: 'None'});

      return res.redirect('https://skillify-frontend-iota.vercel.app');
    } catch (error) {
      console.error('Google Auth Error:', error);

      if (error.code === 11000) {
        return res.redirect(
          'https://skillify-frontend-iota.vercel.app/login/student?error=account_exists'
        );
      }

      return res.redirect(
        'https://skillify-frontend-iota.vercel.app/login/student?error=google_login_failed'
      );
    }
  }
);

router.route('/logout').get(function (req, res) {
  req.logout(() => {
    res.redirect('https://skillify-frontend-iota.vercel.app');
  });
});

router.route('/me').get(isLoggedin, function (req, res) {
  try {
    if (req.user) {
      return res.status(200).json(req.user);
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    return res.status(500).json({
      message:
        error instanceof Error ? error.message : 'Error fetching loggedin user',
    });
  }
});

router.route('/complete').post(isLoggedin, asyncHandler(completeLessons));

router
  .route('/completed-lessons')
  .get(isLoggedin, asyncHandler(getCompletedLessons));

router
  .route('/progress/:courseId/:lessonId')
  .get(isLoggedin, asyncHandler(calculateProgress));


router.route("/enrolled-course-instructors").get(isLoggedin,getInstructors)

export default router;
