const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

dotenv.config({ path: "config.env" });
const ApiError = require("./utils/ApiError");
const dbConnection = require("./config/database");
const categoryRoute = require("./routes/categoryRoute");

//! Connection with db
dbConnection();

//! Express app
const app = express();

//! Middlewares
app.use(express.json()); // Middleware for parsing JSON bodies

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`Mode: ${process.env.NODE_ENV}`);
}

//! Mount Routes
app.use("/api/v1/categories", categoryRoute);

//! Handling Unknown Routes
app.all("*", (req, res, next) => {
  // const err = new Error(`Can't find this route ${req.originalUrl}`);
  // next(err.message);
  next(new ApiError(`Can't find this route ${req.originalUrl}`, 400));
});

//! Global Error handling middleware
app.use((err, req, res, next) => {
  console.error("ERROR💥 " + err.message);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
