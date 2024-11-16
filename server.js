// Core modules
const path = require("path");

// Third party modules
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

// Require modules from project
dotenv.config({ path: "config.env" });
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");
const dbConnection = require("./config/database");
// Routes
const categoryRoute = require("./routes/categoryRoute");
const subCategoryRoute = require("./routes/subCategoryRoute");
const brandRoute = require("./routes/brandRoute");
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");

//! Connection with db
dbConnection();

//! Express app
const app = express();

//! Middlewares
app.use(express.json()); // Middleware for parsing JSON bodies
app.use(express.static(path.join(__dirname, "uploads"))); // serve static files in 'uploads'

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`Mode: ${process.env.NODE_ENV}`);
} else {
  console.log(`Mode: ${process.env.NODE_ENV}`);
}

//! Mount Routes
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subcategories", subCategoryRoute);
app.use("/api/v1/brands", brandRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", authRoute);

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
