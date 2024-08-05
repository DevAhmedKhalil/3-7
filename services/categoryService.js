const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const Factory = require("./handlersFactory");

const CategoryModel = require("../models/categoryModel");

// @desc      Get a list of categories
// @route     GET /api/v1/categories
// @access    Public 'anyone'
exports.getCategories = asyncHandler(async (req, res) => {
  //! Build a query
  const countDocuments = await CategoryModel.countDocuments();

  const apiFeatures = new ApiFeatures(CategoryModel.find(), req.query)
    .paginate(countDocuments)
    .filter()
    .sort()
    .limitFields()
    .search();

  //! Execute query
  const { mongooseQuery, paginationResult } = apiFeatures;
  const categories = await mongooseQuery;

  res
    .status(200)
    .json({ results: categories.length, paginationResult, data: categories });
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
  console.log(`name: ${name}`);

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

exports.deleteCategory = Factory.deleteOne(CategoryModel);

// exports.deleteCategory = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;

//   const category = await CategoryModel.findOneAndDelete({ _id: id });
//   if (!category)
//     return next(new ApiError(`No category found with this ID ${id}`, 404));

//   res.status(204).send(); // No Content = deleted
// });
