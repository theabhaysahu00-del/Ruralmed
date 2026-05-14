const AppError = require('../utils/AppError');

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    throw new AppError(`Validation failed: ${errors.map(e => e.message).join(', ')}`, 400);
  }
  req.validatedBody = result.data;
  next();
};

module.exports = validate;
