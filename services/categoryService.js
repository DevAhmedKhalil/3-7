const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const Factory = require("./handlersFactory");
const CategoryModel = require("../models/categoryModel");
const ApiError = require("../utils/apiError");

//! 1- Disk Storage engine
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/categories");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
    cb(null, filename);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new ApiError("Not an image!", 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
exports.uploadCategoryImage = upload.single("image");

// @desc      Get a list of categories
// @route     GET /api/v1/categories
// @access    Public 'anyone'
exports.getCategories = Factory.getAll(CategoryModel);

// @desc      Get a specific category by id
// @route     GET /api/v1/categories/:id
// @access    Public 'anyone'
exports.getCategory = Factory.getOne(CategoryModel);

// @desc      Create a new category
// @route     POST /api/v1/category
// @access    Private 'admin'
exports.createCategory = Factory.createOne(CategoryModel);

// @desc      Update category
// @route     PUT /api/v1/category/:id
// @access    Private 'admin'
exports.updateCategory = Factory.updateOne(CategoryModel);

// @desc      Delete category
// @route     DELETE /api/v1/category/:id
// @access    Private 'admin'
exports.deleteCategory = Factory.deleteOne(CategoryModel);
