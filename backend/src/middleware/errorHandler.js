/**
 * Error Handler Middleware
 * Centralized error handling for consistent error responses
 */

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: errors.join(', ')
    });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID',
      message: 'Invalid resource ID format'
    });
  }

  // Duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      error: 'Duplicate Error',
      message: `${field} already exists`
    });
  }

  // Multer file upload errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File Too Large',
        message: 'File size exceeds 5MB limit'
      });
    }
    return res.status(400).json({
      success: false,
      error: 'Upload Error',
      message: err.message
    });
  }

  // Custom application errors
  if (err.message) {
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      error: err.name || 'Error',
      message: err.message
    });
  }

  // Default server error
  res.status(500).json({
    success: false,
    error: 'Server Error',
    message: 'An unexpected error occurred'
  });
};

module.exports = errorHandler;
