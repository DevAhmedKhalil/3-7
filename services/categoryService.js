const Factory = require("./handlersFactory");
const CategoryModel = require("../models/categoryModel");

// @desc      Get a list of categories
// @route     GET /api/v1/categories
// @access    Public 'anyone'
exports.getCategories = Factory.getAll(CategoryModel);
// exports.getCategories = asyncHandler(async (req, res) => {
//   //! Build a query
//   const countDocuments = await CategoryModel.countDocuments();

//   const apiFeatures = new ApiFeatures(CategoryModel.find(), req.query)
//     .paginate(countDocuments)
//     .filter()
//     .sort()
//     .limitFields()
//     .search();

//   //! Execute query
//   const { mongooseQuery, paginationResult } = apiFeatures;
//   const categories = await mongooseQuery;

//   res
//     .status(200)
//     .json({ results: categories.length, paginationResult, data: categories });
// });

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
