// @desc => The 'ApiError' class is a custom error class designed to handle operational errors that can be predicted
class ApiError extends Error {
  constructor(message, statusCode) {
    super(message); // Call the parent class's[Error] constructor with the message
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith(4) ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor); // For debugging purposes
  }
}

module.exports = ApiError;
