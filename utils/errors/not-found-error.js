const { CustomError } = require('./custom-error');

class NotFoundError extends CustomError {
    statusCode;

    message;

    constructor() {
      super('Route not found');
      this.statusCode = 404;
      this.message = 'Not found';
      Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    serializeErrors() {
      return [{ message: this.message }];
    }
}

module.exports = { NotFoundError };
