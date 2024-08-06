const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const Factory = require("./handlersFactory");

const SubCategoryModel = require("../models/subCategoryModel");

exports.setCategoryIdToBody = (req, res, next) => {
  //@ for nested route
  if (!req.body.category) {
    req.body.category = req.params.categoryId;
  }
  next();
};

exports.createFilterObj = (req, res, next) => {
  let filteredObj = {};
  if (req.params.categoryId) {
    filteredObj = { category: req.params.categoryId };
  }
  req.filteredObj = filteredObj;
  next();
};

// @desc      Get a list of subCategories
// @route     GET /api/v1/subcategories
// @access    Public 'anyone'
exports.getSubCategories = asyncHandler(async (req, res) => {
  //! Build a query
  const countDocuments = await SubCategoryModel.countDocuments();
  const apiFeatures = new ApiFeatures(SubCategoryModel.find(), req.query)
    .paginate(countDocuments)
    .filter()
    .sort()
    .limitFields()
    .search();

  //! Execute query
  const { mongooseQuery, paginationResult } = apiFeatures;
  const subcategories = await mongooseQuery;

  res.status(200).json({
    results: subcategories.length,
    paginationResult,
    data: subcategories,
  });
});

// @desc      Get a specific subCategory by id
// @route     GET /api/v1/subcategories/:id
// @access    Public 'anyone'
exports.getSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategoryModel.findById(id).populate({
    path: "category",
    select: "name",
  });

  if (!subCategory)
    return next(new ApiError(`No subcategory found with this ID ${id}`, 404));

  res.status(200).json({ data: subCategory });
});

// @desc      Create a new subCategory
// @route     POST /api/v1/subCategory
// @access    Private 'admin'
exports.createSubCategory = Factory.createOne(SubCategoryModel);
// exports.createSubCategory = asyncHandler(async (req, res) => {
//   const { name, category } = req.body;
//   console.log(`name: ${name}`);

//   const subCategory = await SubCategoryModel.create({
//     name,
//     slug: slugify(name),
//     category,
//   });

//   // Populate the category field in subCategory
//   const populatedSubCategory = await SubCategoryModel.findById(
//     subCategory._id
//   ).populate({ path: "category", select: "name" });

//   res.status(201).json({ data: populatedSubCategory });
// });

// @desc      Update subCategory
// @route     PUT /api/v1/subcategory/:id
// @access    Private 'admin'
exports.updateSubCategory = Factory.updateOne(SubCategoryModel);

// @desc      Delete subCategory
// @route     DELETE /api/v1/subcategory/:id
// @access    Private 'admin'
exports.deleteSubCategory = Factory.deleteOne(SubCategoryModel);
