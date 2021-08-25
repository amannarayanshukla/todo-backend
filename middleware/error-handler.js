const { CustomError } = require('../utils/errors/custom-error');

const errorHandler = (
  err,
  req,
  res,
  // eslint-disable-next-line no-unused-vars
  next,
) => {
  if (err instanceof CustomError) {
    return res
      .status(err.statusCode)
      .json({ success: false, errors: err.serializeErrors() });
  }

  return res.status(400).json({
    success: false,
    errors: [{ message: err.message || 'Something went wrong' }],
  });
};

module.exports = { errorHandler };
