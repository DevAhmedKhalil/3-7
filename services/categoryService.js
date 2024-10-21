const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandle = require("express-async-handler");
const { default: slugify } = require("slugify");

const Factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const CategoryModel = require("../models/categoryModel");

//! Upload single image middleware
exports.uploadCategoryImage = uploadSingleImage("image");

//! Image Processing using 'sharp'
exports.resizeImage = asyncHandle(async (req, res, next) => {
  if (!req.file) return next();

  // Ensure the directory exists
  const uploadDir = path.join(__dirname, "../uploads/categories");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Generate a secure filename
  const category = req.params.id
    ? await CategoryModel.findById(req.params.id)
    : null;
  const filename = `category-${slugify(category ? category.name : req.body.name, "_").toLowerCase()}-${uuidv4()}-${Date.now()}.jpeg`;

  // Process the image with sharp
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(path.join(uploadDir, filename)); // Save image in disk storage

  req.body.image = filename; // Save image name in DB

  next();
});

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
