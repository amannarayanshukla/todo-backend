const {CustomError} = require('./custom-error')
const {ValidationError} = require('express-validator')

export class RequestValidationError extends CustomError {
  errors;

  statusCode;

  constructor(errors, statusCode) {
    super("Error while validating");
    this.errors = errors;
    this.statusCode = statusCode || 400;

    // Since we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((err) => ({ message: err.msg, field: err.param }));
  }
}
