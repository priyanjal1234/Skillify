import ApiError from './ApiError.js';

// Error Handler function 

function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      message: err.message, 
      success: err.success,
    });
  } else {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: err.message || 'Internal Server Error',
    });
  }
}

export default errorHandler;
