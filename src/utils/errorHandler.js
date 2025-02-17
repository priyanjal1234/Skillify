import ApiError from './ApiError.js';

function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
    });
  } else {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: err.message || 'Internal Server Error',
    });
  }
}

export default errorHandler
