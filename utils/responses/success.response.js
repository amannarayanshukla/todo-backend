const successResponseHandler = (res, message, statusCode, data, success = true) => res.status(statusCode).json({
  success,
  message,
  data,
});

module.exports = { successResponseHandler };
