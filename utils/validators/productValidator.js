const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

//@ CREATE Product Validator
exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title should be between 3 and 100 characters"),

  check("description")
    .notEmpty()
    .withMessage("Product Description is required")
    .isLength({ min: 10, max: 2000 })
    .withMessage("Description should be between 10 and 2000 characters"),

  check("quantity")
    .notEmpty()
    .withMessage("Product Quantity is required")
    .isInt({ min: 0 })
    .withMessage("Quantity should be a positive integer"),

  check("sold").optional().isNumeric().withMessage("Sold should be a number"),

  check("price")
    .notEmpty()
    .withMessage("Product Price is required")
    .isNumeric()
    .withMessage("Price must be a number")
    .isLength({ max: 20 })
    .withMessage("Price should not exceed 20 digits"),

  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Discounted Price should be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (value >= req.body.price) {
        throw new Error("Discounted price should be less than original price");
      }
      return true;
    }),

  check("colors")
    .optional()
    .isArray()
    .withMessage("Colors should be an array of strings"),

  check("imageCover").notEmpty().withMessage("Product Image Cover is required"),

  check("images")
    .optional()
    .isArray()
    .withMessage("Product Images should be an array of strings"),

  check("category")
    .notEmpty()
    .withMessage("Product must be categorized")
    .isMongoId()
    .withMessage("Invalid category ID format"),

  check("subCategory")
    .optional()
    .isMongoId()
    .withMessage("Invalid subcategory ID format"),

  check("brand").optional().isMongoId().withMessage("Invalid brand ID format"),

  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("Ratings average must be a number")
    .isLength({ min: 1 })
    .withMessage("Ratings average should be at least 1")
    .isLength({ max: 5 })
    .withMessage("Ratings average should be between 1 and 5"),

  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("Ratings quantity must be a number"),

  validatorMiddleware,
];

//@ GET Product Validator
exports.getProductValidator = [
  check("id")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Invalid product ID format"),
  validatorMiddleware,
];

//@ UPDATE Product Validator
exports.updateProductValidator = [
  check("id")
    .notEmpty()
    .withMessage("Category ID is required")
    .isMongoId()
    .withMessage("Invalid ID format"),
  validatorMiddleware,
];

//@ DELETE Product Validator
exports.deleteProductValidator = [
  check("id")
    .notEmpty()
    .withMessage("Category ID is required")
    .isMongoId()
    .withMessage("Invalid ID format"),
  validatorMiddleware,
];
