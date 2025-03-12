import { allowedEmails } from '../constants.js';
import userModel from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';

async function isAdmin(req, res, next) {
  try {
    let user = await userModel.findOne({ email: req.user.email });

    if (allowedEmails.includes(user.email)) {
      return next();
    }
    return res
      .status(403)
      .json({ message: 'Access Denied for the next routes' });
  } catch (error) {
    return next(
      new ApiError(
        500,
        error instanceof Error
          ? error.message
          : 'Error occurred while identifying admin'
      )
    );
  }
}

export default isAdmin;
