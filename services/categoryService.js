const CategoryModel = require("../models/categoryModel");

const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");

// @desc      Get a list of categories
// @route     GET /api/v1/categories
// @access    Public 'anyone'
exports.getCategories = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 2;
  const skip = (page - 1) * limit;

  const categories = await CategoryModel.find({}).skip(skip).limit(limit);

  res.status(200).json({ results: categories.length, page, data: categories });
});

// @desc      Get a specific category by id
// @route     GET /api/v1/categories/:id
// @access    Public 'anyone'
exports.getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await CategoryModel.findById(id);

  if (!category)
    return next(new ApiError(`No category found with this ID ${id}`, 404));

  res.status(200).json({ data: category });
});

// @desc      Create a new category
// @route     POST /api/v1/category
// @access    Private 'admin'
exports.createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  console.log("name: " + name);

  const category = await CategoryModel.create({ name, slug: slugify(name) });
  res.status(201).json({ data: category });
});

// @desc      Update category
// @route     PUT /api/v1/category/:id
// @access    Private 'admin'
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  // Find category by id and update with data from req.body
  const category = await CategoryModel.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!category)
    return next(new ApiError(`No category found with this ID ${id}`, 404));

  res.status(200).json({ data: category });
});

// @desc      Delete category
// @route     DELETE /api/v1/category/:id
// @access    Private 'admin'
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await CategoryModel.findOneAndDelete({ _id: id });
  if (!category)
    return next(new ApiError(`No category found with this ID ${id}`, 404));

  res.status(204).send(); // No Content = deleted
});
