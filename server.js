const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

dotenv.config({ path: "config.env" });
const ApiError = require("./utils/ApiError");
const globalError = require("./middlewares/errorMiddleware");
const dbConnection = require("./config/database");
const categoryRoute = require("./routes/categoryRoute");
const subCategoryRoute = require("./routes/subCategoryRoute");

//! Connection with db
dbConnection();

//! Express app
const app = express();

//! Middlewares
app.use(express.json()); // Middleware for parsing JSON bodies

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`Mode: ${process.env.NODE_ENV}`);
} else {
  console.log(`Mode: ${process.env.NODE_ENV}`);
}

//! Mount Routes
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subcategories", subCategoryRoute);

//! Handling Unknown Routes
app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route ${req.originalUrl}`, 400));
});

//! Global Error handling middleware 'for Express'
app.use(globalError);

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

//! Handling Rejection 'Outside Express'
process.on("unhandledRejection", (err, promise) => {
  console.log(
    `💥 Unhandled rejection Errors: ${err.name} | ${err.message} | at: ${err.stack}`
  );
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});
