const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category name is required.")
    .isLength({ min: 2 })
    .withMessage("Too short category name.")
    .isLength({ max: 32 })
    .withMessage("Too long category name."),
  check("category")
    .notEmpty()
    .withMessage("subCategory must be belongs to a category.")
    .isMongoId()
    .withMessage("Invalid Category ID Format."),
  validatorMiddleware,
];
