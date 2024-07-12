const globalError = (err, req, res, next) => {
  console.log(
    "NODE_ENV=" + process.env.NODE_ENV + "\nGlobal ERROR💥 " + err.message
  );

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Send error response
  sendErrorResponse(err, req, res);
};

const sendErrorResponse = (err, req, res) => {
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else {
    sendErrorProd(err, res);
  }
};

const sendErrorDev = (err, res) => {
  console.log("IN sendErrorDev 🌋");

  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  console.log("IN sendErrorProd 🌋");

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

module.exports = globalError;
