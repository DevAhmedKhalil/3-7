const crypto = require("crypto"); // nodejs bult in tool

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

// @desc Signup
// @route POST /api/v1/auth/signup
// @access Public
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

// @desc Login
// @route POST /api/v1/auth/login
// @access Public
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

// @desc Make sure that the user is authenticated (logged in)
// @ Authentication => Who Are You?
exports.protect = asyncHandler(async (req, res, next) => {
  // console.log(req.headers);

  // 1- Check if token exists & Hold token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    console.log(token);
  }
  if (!token) {
    return next(
      new ApiError("You are not logged in! Please log in to access.", 401)
    );
  }

  // 2- Verify token (no change happens, expired token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  console.log(decoded);

  // 3- Check if user exist
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(new ApiError("User no longer exists!", 401));
  }

  // 4- Check if user change his password after token created
  if (currentUser.passwordChangedAt) {
    // console.log(currentUser.passwordChangedAt, decoded.password);

    const passwordChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );

    // Password changed after token created (ERROR)
    if (passwordChangedTimestamp > decoded.iat) {
      return next(
        new ApiError(
          "User recently changed password! Please log in again.",
          401
        )
      );
    }
  }

  req.user = currentUser;
  next();
});

// @ Authorization => User Permissions
// ['admin', 'manager']
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    // 1) Access roles
    // 2) Access registered user [req.user.role]
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not authorized to access this resource.", 403)
      );
    }
    next();
  });

// @desc Forgot Password
// @route POST /api/v1/auth/forgotPassword
// @access Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1- Get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`No user found with this email ${req.body.email}`, 404)
    );
  }

  // 2- If user exists, Generate Hashed reset random 6 digits and Save it into DB
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  // Save hashed reset code into DB
  user.passwordResetCode = hashedResetCode;
  // Reset code valid for 10 minutes
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  user.passwordResetVerified = false;
  await user.save();

  // 3- Send reset code to email
});
