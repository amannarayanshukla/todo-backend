const {CustomError} = require('./custom-error')

class DatabaseConnectionError extends CustomError {
  reason;

  statusCode;

  constructor() {
    super("Error connecting to database");
    this.reason = "Error connecting to config";
    this.statusCode = 500;
    // Since we are extending a built in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}

module.exports = {DatabaseConnectionError}
