const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");

const SubCategoryModel = require("../models/subCategoryModel");

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

  res.status(201).json({ data: subCategory });
});
