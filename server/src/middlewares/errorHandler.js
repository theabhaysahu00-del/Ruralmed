const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle Zod validation errors
  if (err.name === 'ZodError' || err.issues) {
    statusCode = 400;
    const fieldErrors = (err.issues || err.errors || []).map(e => `${e.path?.join('.')}: ${e.message}`);
    message = `Validation failed: ${fieldErrors.join(', ')}`;
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const fields = Object.values(err.errors).map(e => e.message);
    message = `Validation failed: ${fields.join(', ')}`;
  }

  // Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue).join(', ');
    message = `Duplicate value for: ${field}. This ${field} is already registered.`;
  }

  // Handle Multer file upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    message = 'File size too large. Maximum allowed is 5MB.';
  }

  if (err.message && err.message.includes('Invalid file type')) {
    statusCode = 400;
    message = err.message;
  }

  logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`, {
    stack: err.stack,
  });

  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
