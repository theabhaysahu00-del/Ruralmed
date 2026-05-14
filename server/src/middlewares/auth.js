const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

const auth = (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    throw new AppError('Access denied. No token provided.', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    throw new AppError('Invalid or expired token.', 401);
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    throw new AppError('You do not have permission to perform this action.', 403);
  }
  next();
};

module.exports = { auth, authorize };
