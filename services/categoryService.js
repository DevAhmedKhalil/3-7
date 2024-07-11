const CategoryModel = require("../models/categoryModel");

const slugify = require("slugify");
const asyncHandler = require("express-async-handler");

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

// @desc      Create a new category
// @route     POST /api/v1/category
// @access    Private 'admin'
exports.createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  console.log("name: " + name);

  const category = await CategoryModel.create({ name, slug: slugify(name) });
  res.status(201).json({ data: category });
});
