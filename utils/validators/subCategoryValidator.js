const slugify = require("slugify");
const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

//@ CREATE Sub Category Validator
exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category name is required.")
    .isLength({ min: 2 })
    .withMessage("Too short category name.")
    .isLength({ max: 32 })
    .withMessage("Too long category name.")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("subCategory must be belongs to a category.")
    .isMongoId()
    .withMessage("Invalid Category ID Format."),
  validatorMiddleware,
];

//@ GET Sub Category Validator
exports.getSubCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("Category ID is required.")
    .isMongoId()
    .withMessage("Invalid ID format."),
  validatorMiddleware,
];

//@ UPDATE Sub Category Validator
exports.updateSubCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("Category ID is required.")
    .isMongoId()
    .withMessage("Invalid ID format."),
  check("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

//@ DELETE Sub Category Validator
exports.deleteSubCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("Category ID is required.")
    .isMongoId()
    .withMessage("Invalid ID format."),
  validatorMiddleware,
];
