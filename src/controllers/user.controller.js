import userModel from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import generateVerificationCode from '../utils/generateVerificationCode.js';
import generateToken from '../utils/generateToken.js';
import crypto from 'crypto';
import sendMail from '../utils/sendEmail.js';

import courseModel from '../models/course.model.js';
import activityModel from '../models/activity.model.js';

const registerUser = async function (req, res, next) {
  try {
    let { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return next(new ApiError(400, 'All Fields are required'));
    }

    let user = await userModel.findOne({ email });

    if (user) {
      return next(
        new ApiError(409, 'User with this email is already registered')
      );
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

    await sendMail(user.name, verificationCode, email);

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
      res.cookie('token', token,{

httpOnly: true,
  secure: true,
  sameSite: 'None',
	});
      user.isVerified = true;
      user.verificationCode = undefined;
      user.verificationCodeExpiry = undefined;
      await user.save();
      await activityModel.create({
        type: 'registration',
        user: user._id,
        description: `${user.name} is registered`,
      });
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
    let { email, password, role } = req.body;

    if (!email || !password || !role) {
      return next(new ApiError(400, 'Email, Password, and Role are required'));
    }

    email = email.trim().toLowerCase(); // Normalize email
    role = role.trim().toLowerCase(); // Normalize role

    let user = await userModel.findOne({ email });
    if (!user) {
      return next(new ApiError(404, 'You are not registered'));
    }

    if (!user.password) {
      return next(
        new ApiError(
          401,
          'You are already authenticated with google. Try Logging in with Google'
        )
      );
    }

    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new ApiError(401, 'Invalid Credentials'));
    }

    if (user.role.toLowerCase() !== role) {
      return next(
        new ApiError(403, `${user.role}s should login from their login page`)
      );
    }

    let token = generateToken(user.name, user.email);

    // Set cookie with security options
    res.cookie('token', token,{
httpOnly: true,
  secure: true,
  sameSite: 'None',

});

    return res.status(200).json({ message: 'Login Success', token });
  } catch (error) {
    return next(new ApiError(500, error.message || 'Error Logging in'));
  }
};

const getLoggedinUser = async function (req, res, next) {
  try {
    let user = await userModel
      .findOne({ email: req.user.email })
      .select('-password');
    if (!user) return;
    return res.status(200).json(user);
  } catch (error) {
    return next(
      new ApiError(500, error.message || 'Error in Getting Loggedin User')
    );
  }
};

const updateLoggedinUser = async function (req, res, next) {
  try {
    const { name, email, role } = req.body;
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
          role: role || user.role,
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
          role: role || user.role,
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

const logoutUser = async function (req, res, next) {
  try {
    res.clearCookie('token');
    await activityModel.deleteMany({
      createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });
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

    const resettoken = generateVerificationCode();


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
      from: 'Skillify Support',
      to: email,
      subject: 'Password Reset',
      html: `<p>Hello ${user.name},</p>
            <p>OTP to reset password: ${resettoken}</p>`,
    };

    await transporter.sendMail(mailOptions);

    return res
      .status(200)
      .json({ message: 'Check your email for reset password OTP' });
  } catch (error) {
    return next(
      new ApiError(
        500,
        error.message || 'Error occurred in the forgot password'
      )
    );
  }
};

const verifyOTP = async function(req,res,next) {

	try {
 let {email,otp} = req.body
        if(!otp) return next(new ApiError(400,"OTP is required"))
        let user = await userModel.findOne({email})
        if(!user) return next(new ApiError(404,"User with this email not found"))
        if(Number(user.resetPasswordToken) === Number(otp)) {
        return res.status(200).json({message: "OTP verified"})


}

else  {

return next(new ApiError(401,"OTP is invalid"))

}


}

catch(error) {


return next(new ApiError(500, error instanceof Error ? error.message : "Error validating OTP"));



}

}

const resetPassword = async function (req, res, next) {
  try {
    
    let { password } = req.body;

    if (!password) {
      return next(new ApiError(400, 'Password is required'));
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

const completeLessons = async function (req, res, next) {
  try {
    let { lessonId } = req.body;

    let student = await userModel.findOne({ email: req.user.email });
    if (!student.completedLessons.includes(lessonId)) {
      student.completedLessons.push(lessonId);
      await student.save();
    }
    return res.status(200).json({ message: 'Lesson is completed' });
  } catch (error) {
    return next(
      new ApiError(
        500,
        error instanceof Error
          ? error.message
          : 'Error in changing the lesson complete status'
      )
    );
  }
};

const getCompletedLessons = async function (req, res, next) {
  try {
    let student = await userModel
      .findOne({ email: req.user.email })
      .select('completedLessons');
    return res.status(200).json(student.completedLessons);
  } catch (error) {
    return next(
      new ApiError(
        500,
        error instanceof Error
          ? error.message
          : 'Error fetching completed lessons'
      )
    );
  }
};

const calculateProgress = async function (req, res, next) {
  try {
    let { courseId, lessonId } = req.params;
    let student = await userModel.findOne({ email: req.user.email });
    let course = await courseModel.findOne({ _id: courseId });

    if (!course) {
      return next(new ApiError(404, 'Course with this id not found'));
    }
    let lessonsCompleted = course.lessons.filter((lesson) =>
      student.completedLessons.includes(lesson.toString())
    ).length;

    let totalLessons = course.lessons.length;
    let percentageCompletion = (lessonsCompleted / totalLessons) * 100;

    return res.status(200).json(percentageCompletion);
  } catch (error) {
    return next(
      new ApiError(
        500,
        error instanceof Error
          ? error.message
          : 'Error occurred while calculating the percentage completion of the course'
      )
    );
  }
};

const getInstructors = async function (req, res, next) {
  try {
    let user = await userModel.findOne({ email: req.user.email });
    let enrolledCourseIds = user.enrolledCourses;

    if (!enrolledCourseIds || enrolledCourseIds.length === 0) {
      return next(
        new ApiError(404, 'You are not enrolled in any of the course')
      );
    }

    let courses = await courseModel
      .find({ _id: { $in: enrolledCourseIds } })
      .select('instructor')
      .populate('instructor', 'name');

    const instructorMap = new Map();
    courses.forEach(function (course) {
      const instructor = course.instructor;
      if (instructor && !instructorMap.has(instructor._id.toString())) {
        instructorMap.set(instructor._id, instructor);
      }
    });

    const instructors = Array.from(instructorMap.values());
    return res.status(200).json(instructors);
  } catch (error) {
    return next(
      new ApiError(
        500,
        error instanceof Error ? error.message : 'Error fetching instructor'
      )
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
verifyOTP
  resetPassword,
  updateLoggedinUser,
  completeLessons,
  getCompletedLessons,
  calculateProgress,
  getInstructors,
};
