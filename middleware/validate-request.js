const { validationResult } = require('express-validator');
const {
  RequestValidationError,
} = require('../utils/errors/request-validation-error');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array(), 400);
  }

  next();
};

module.exports = { validateRequest };
