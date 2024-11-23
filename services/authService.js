const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const User = require("../models/userModel");

const createToken = (payload) =>
  jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    // algorithm: "HS256",
    expiresIn: process.env.JWT_EXPIRE_TIME || "7d",
  });

exports.signup = asyncHandler(async (req, res, next) => {
  // 1- Create user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  // 2- Generate token
  const token = createToken(user._id);

  res.status(201).json({
    data: user,
    token,
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  // 1- Check if password & email in the body (validation layer)
  // 2- Check if user exist & Check if password is correct
  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Incorrect email or password!", 401));
  }

  // 3- Generate token
  const token = createToken(user._id);

  // 4- Send response to client side
  res.status(200).json({ data: user, token });
});
