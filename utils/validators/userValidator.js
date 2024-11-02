const slugify = require("slugify");
const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../models/userModel");

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("User name is required.")
    .isLength({ min: 3 })
    .withMessage("Too short User name.")
    .isLength({ max: 50 })
    .withMessage("Too long User name.")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Invalid email address.")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email already in user."));
        }
      })
    ),

  check("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters."),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password Confirm is required.")
    .custom((passwordConfirm, { req }) => {
      if (passwordConfirm !== req.body.password) {
        throw new Error("Passwords Confirmation Incorrect.");
      }
      return true;
    }),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accepted Egy and SA numbers."),

  check("profileImg").optional(),

  validatorMiddleware,
];

exports.getUserValidator = [
  //@ 1- Rules
  check("id").isMongoId().withMessage("Invalid ID format."),
  //@ 2- Middleware --> Catch errors from Rules if exists
  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid ID format."),
  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid ID format."),
  validatorMiddleware,
];
