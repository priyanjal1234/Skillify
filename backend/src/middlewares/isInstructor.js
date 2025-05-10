import userModel from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';

async function isInstructor(req, res, next) {
  try {
    let user = await userModel.findOne({ email: req.user.email });
    if (user?.role === 'instructor') {
      return next();
    }
    return next(new ApiError(403, 'Access Denied. User is not an instructor'));
  } catch (error) {
    return next(
      new ApiError(
        500,
        error instanceof Error
          ? error.message
          : 'Error identifying User as Instructor'
      )
    );
  }
}

export default isInstructor;
