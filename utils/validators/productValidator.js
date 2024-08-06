const slugify = require("slugify");
const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const CategoryModel = require("../../models/categoryModel");
const SubCategoryModel = require("../../models/subCategoryModel");

//@ CREATE Product Validator
exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title should be between 3 and 100 characters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
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
    .withMessage("Invalid category ID format")
    .custom(async (categoryId) => {
      const category = await CategoryModel.findById(categoryId);
      if (!category) {
        throw new Error(`No category found for this id: ${categoryId}`);
      }
    }),

  check("subCategories")
    .optional()
    .isArray()
    .withMessage("Subcategories should be an array")
    .custom(async (subCategoriesIds) => {
      if (!subCategoriesIds) return;
      // Validate that all subCategoriesIds exist in the database
      const subCategoriesInDb = await SubCategoryModel.find({
        _id: { $exists: true, $in: subCategoriesIds },
      });
      if (
        subCategoriesInDb.length < 1 ||
        subCategoriesInDb.length !== subCategoriesIds.length
      ) {
        throw new Error(`Invalid subcategories IDs`);
      }
    })
    .custom(async (value, { req }) => {
      if (!value) return;
      // Check if subCategories belong to the provided category
      const subcategories = await SubCategoryModel.find({
        category: req.body.category,
      });
      const subCategoriesIdsInDB = subcategories.map((subCategory) =>
        subCategory._id.toString()
      );
      const checker = (target, arr) => target.every((v) => arr.includes(v));
      if (!checker(value, subCategoriesIdsInDB)) {
        throw new Error(`Subcategories do not belong to the category`);
      }
    }),

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
  check("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
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
