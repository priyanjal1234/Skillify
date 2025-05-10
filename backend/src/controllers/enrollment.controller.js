import enrollmentModel from '../models/enrollment.model.js';
import userModel from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';

const getEnrolledStudents = async function (req, res, next) {
  try {
    let instructor = await userModel.findOne({ email: req.user.email });
    let enrolledStudents = await enrollmentModel
      .find({ instructor: instructor._id })
      .populate('student');
    return res.status(200).json(enrolledStudents);
  } catch (error) {
    return next(
      new ApiError(
        500,
        error instanceof Error
          ? error.message
          : 'Error fetching enrolled students'
      )
    );
  }
};

export { getEnrolledStudents };
