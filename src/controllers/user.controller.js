import userModel from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import generateVerificationCode from '../utils/generateVerificationCode.js';
import generateToken from '../utils/generateToken.js';
import crypto from 'crypto';
import sendMail from '../utils/sendEmail.js';

const registerUser = async function (req, res, next) {
  try {
    let { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return next(new ApiError(400, 'All Fields are required'));
    }

    let user = await userModel.findOne({ email });

    if (user) {
      return next(new ApiError(409, 'You are already registered'));
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const verificationCode = generateVerificationCode();
    const verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user = await userModel.create({
      name,
      email,
      password: hash,
      role,
      verificationCode,
      verificationCodeExpiry,
    });

    await sendMail(user.name, verificationCode,email);

    return res
      .status(201)
      .json({ message: 'Check Your Email For Verification' });
  } catch (error) {
    return next(new ApiError(500, error.message || 'Error Registering User'));
  }
};

const resendCode = async function (req, res, next) {
  try {
    let { email } = req.body;

    if (!email) {
      return next(new ApiError(400, 'Write the Email in the input box'));
    }

    let user = await userModel.findOne({ email });
    if (!user) {
      return next(new ApiError(404, 'User with this email not found'));
    }

    let newVerificationCode = generateVerificationCode();
    user.verificationCode = newVerificationCode;
    user.verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    console.log(user);

    await sendMail(user.name, newVerificationCode, email);

    return res
      .status(200)
      .json({ message: 'Check Your Email for Verification Code' });
  } catch (error) {
    return next(
      new ApiError(
        500,
        error instanceof Error ? error.message : 'Error resending code'
      )
    );
  }
};

const verifyEmail = async function (req, res, next) {
  try {
    let { email, verificationCode } = req.body;

    if (!email || !verificationCode) {
      return next(
        new ApiError(400, 'Both Email Address and Code are required')
      );
    }

    let user = await userModel.findOne({ email });
    if (!user) {
      return next(new ApiError(404, 'User with this email not found'));
    }
    
    if (
      Number(verificationCode) === user.verificationCode &&
      user.verificationCodeExpiry > Date.now()
    ) {
      let token = generateToken(user.name, user.email);
      res.cookie('token', token);
      user.isVerified = true
      user.verificationCode = undefined;
      user.verificationCodeExpiry = undefined;
      await user.save();
      return res.status(200).json({ message: 'Email Verified Successfully' });
    } else {
      return next(new ApiError(401, 'Invalid or Expired Code'));
    }
  } catch (error) {
    return next(new ApiError(500, error.message || 'Error Verifying Email'));
  }
};

const loginUser = async function (req, res, next) {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return next(new ApiError(400, 'Both Email and Password are required'));
    }

    let user = await userModel.findOne({ email });
    if (!user) {
      return next(new ApiError(404, 'You are not registered'));
    }

    let isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      let token = generateToken(user.name, user.email);
      res.cookie('token', token);
      return res.status(200).json({ message: 'Login Success' });
    } else {
      return next(new ApiError(401, 'Invalid Credentials'));
    }
  } catch (error) {
    return next(new ApiError(500, error.message || 'Error Logging in'));
  }
};

const getLoggedinUser = async function (req, res, next) {
  try {
    let user = await userModel
      .findOne({ email: req.user.email })
      .select('-password');
    return res.status(200).json(user);
  } catch (error) {
    return next(
      new ApiError(500, error.message || 'Error in Getting Loggedin User')
    );
  }
};

const updateLoggedinUser = async function (req, res, next) {
  try {
    const { name, email } = req.body;

    // Check if the user exists
    let user = await userModel.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let updatedUser;

    // Update the user with or without a profile image
    if (req.file) {
      updatedUser = await userModel.findOneAndUpdate(
        { email: user.email },
        {
          name: name || user.name,
          email: email || user.email,
          profileImage: req.file.path,
        },
        { new: true }
      );
    } else {
      updatedUser = await userModel.findOneAndUpdate(
        { email: user.email },
        {
          name: name || user.name,
          email: email || user.email,
        },
        { new: true }
      );
    }

    if (updatedUser) {
      let newToken = generateToken(updatedUser.name, updatedUser.email);
      res.cookie('token', newToken);
      return res.status(200).json({ message: 'Profile Updated Successfully' });
    }
  } catch (error) {
    return next(
      new ApiError(
        500,
        error instanceof Error ? error.message : 'Error Updating User'
      )
    );
  }
};

const logoutUser = function (req, res, next) {
  try {
    res.clearCookie('token');
    return res.status(200).json({ message: 'Logout Success' });
  } catch (error) {
    return next(new ApiError(500, error.message || 'Error Logging Out User'));
  }
};

const forgotPassword = async function (req, res, next) {
  try {
    let { email } = req.body;

    if (!email) {
      return next(new ApiError(400, 'Email is required'));
    }

    let user = await userModel.findOne({ email });
    if (!user) {
      return next(new ApiError(404, 'User with this email not found'));
    }

    const resettoken = crypto.randomBytes(10).toString('hex');
    const reseturl = `http://localhost:5173/reset-password/${resettoken}`;

    user.resetPasswordToken = resettoken;
    await user.save();

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS,
      },
    });

    let mailOptions = {
      from: 'Learnify Support',
      to: email,
      subject: 'Password Reset',
      html: `<p>Hello ${user.name},</p>
            <p>Click here to reset your password: ${reseturl}</p>`,
    };

    await transporter.sendMail(mailOptions);

    return res
      .status(200)
      .json({ message: 'Check your email for reset password link' });
  } catch (error) {
    return next(
      new ApiError(
        500,
        error.message || 'Error occurred in the forgot password'
      )
    );
  }
};

const resetPassword = async function (req, res, next) {
  try {
    let { token } = req.params;
    let { password } = req.body;

    if (!password) {
      return next(new ApiError(400, 'Password is required'));
    }

    let user = await userModel.findOne({ resetPasswordToken: token });

    if (!user) {
      return next(new ApiError(404, 'User not found with this reset token'));
    }
    let newSalt = await bcrypt.genSalt(10);
    let newHash = await bcrypt.hash(password, newSalt);
    user.password = newHash;
    user.resetPasswordToken = undefined;
    await user.save();
    return res.status(200).json({ message: 'Password Reset Successfully' });
  } catch (error) {
    return next(
      new ApiError(500, error.message || 'Error Resetting the Password')
    );
  }
};

export {
  registerUser,
  verifyEmail,
  resendCode,
  loginUser,
  getLoggedinUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  updateLoggedinUser,
};
