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

  //* Ensure the directory exists
  const uploadDir = path.join(__dirname, "../uploads/categories");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  let filename;

  //* Case 1: When creating a new category (no req.params.id)
  if (!req.params.id) {
    if (!req.body.name) {
      return next(new Error("Category name is required for image processing."));
    }
    filename = `category-${slugify(req.body.name, "_").toLowerCase()}-${uuidv4()}-${Date.now()}.jpeg`;
  } else {
    //* Case 2: When updating an existing category (use req.params.id)
    const category = await CategoryModel.findById(req.params.id);
    if (!category || !category.name) {
      return next(
        new Error("No category found with this ID or category has no name.")
      );
    }
    filename = `category-${slugify(category.name, "_").toLowerCase()}-${uuidv4()}-${Date.now()}.jpeg`;
  }

  try {
    // Process the image with sharp
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(path.join(uploadDir, filename)); // Save image in disk storage

    req.body.image = filename; // Save image name in DB
  } catch (error) {
    return next(new Error("Error processing the image."));
  }

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
