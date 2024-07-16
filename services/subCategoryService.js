const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");

const SubCategoryModel = require("../models/subCategoryModel");

exports.setCategoryIdToBody = (req, res, next) => {
  //@ for nested route
  if (!req.body.category) {
    req.body.category = req.params.categoryId;
  }
  next();
};

// @desc      Create a new subCategory
// @route     POST /api/v1/subCategory
// @access    Private 'admin'
exports.createSubCategory = asyncHandler(async (req, res) => {
  const { name, category } = req.body;
  console.log(`name: ${name}`);

  const subCategory = await SubCategoryModel.create({
    name,
    slug: slugify(name),
    category,
  });

  // Populate the category field in subCategory
  const populatedSubCategory = await SubCategoryModel.findById(
    subCategory._id
  ).populate({ path: "category", select: "name" });

  res.status(201).json({ data: populatedSubCategory });
});

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
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  // console.log(req.params.categoryId);

  const subCategory = await SubCategoryModel.find(req.filteredObj)
    .skip(skip)
    .limit(limit)
    .populate({
      path: "category",
      select: "name",
    });

  res
    .status(200)
    .json({ results: subCategory.length, page, data: subCategory });
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

// @desc      Update subCategory
// @route     PUT /api/v1/subcategory/:id
// @access    Private 'admin'
exports.updateSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;

  // Find category by id and update with data from req.body
  const subCategory = await SubCategoryModel.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name), category },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!subCategory)
    return next(new ApiError(`No subcategory found with this ID ${id}`, 404));

  // Populate the category field in subCategory
  const populatedSubCategory = await SubCategoryModel.findById(
    subCategory._id
  ).populate({ path: "category", select: "name" });

  res.status(200).json({ data: populatedSubCategory });
});

// @desc      Delete subCategory
// @route     DELETE /api/v1/subcategory/:id
// @access    Private 'admin'
exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const subCategory = await SubCategoryModel.findOneAndDelete({ _id: id });
  if (!subCategory)
    return next(new ApiError(`No subcategory found with this ID ${id}`, 404));

  res.status(204).send(); // No Content = deleted
});
