const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const User = require("../models/userModel");

exports.signup = asyncHandler(async (req, res, next) => {
  // 1- Create user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  // 2- Generate token
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    algorithm: "HS256",
    expiresIn: process.env.JWT_EXPIRE_TIME || "7d",
  });

  // 3- Token Validation Logic
  // console.log("User ID:", user._id);
  // console.log(process.env.JWT_SECRET_KEY);
  // console.log("Generated Token:", token);

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error("JWT Validation Error:", err.message);
    } else {
      console.log("Decoded Token:", decoded);
    }
  });

  res.status(201).json({
    data: user,
    token,
  });
});

// exports.login = asyncHandler(async (req, res, next) => {});
