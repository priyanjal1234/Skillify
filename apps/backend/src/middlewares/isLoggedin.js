import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';

const isLoggedin = function (req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      throw new ApiError(404, 'Token not found');
    }

    const userData = jwt.verify(token, process.env.JWT_KEY);
    req.user = userData;
    next();
  } catch (error) {
    throw new ApiError(
      500,
      error instanceof Error ? error.message : 'Error Authenticating User'
    );
  }
};

export default isLoggedin
