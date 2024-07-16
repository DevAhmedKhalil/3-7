const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");

const BrandModel = require("../models/brandModel");

// @desc      Get a list of brands
// @route     GET /api/v1/brands
// @access    Public 'anyone'
exports.getBrands = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  const brands = await BrandModel.find({}).skip(skip).limit(limit);

  res.status(200).json({ results: brands.length, page, data: brands });
});

// @desc      Get a specific brand by id
// @route     GET /api/v1/brands/:id
// @access    Public 'anyone'
exports.getBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await BrandModel.findById(id);

  if (!brand)
    return next(new ApiError(`No brand found with this ID ${id}`, 404));

  res.status(200).json({ data: brand });
});

// @desc      Create a new brand
// @route     POST /api/v1/brands
// @access    Private 'admin'
exports.createBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;
  console.log(`name: ${name}`);

  const category = await BrandModel.create({ name, slug: slugify(name) });
  res.status(201).json({ data: category });
});

// @desc      Update category
// @route     PUT /api/v1/brands/:id
// @access    Private 'admin'
exports.updateBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  // Find category by id and update with data from req.body
  const brand = await BrandModel.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!brand)
    return next(new ApiError(`No category found with this ID ${id}`, 404));

  res.status(200).json({ data: brand });
});

// @desc      Delete brand
// @route     DELETE /api/v1/brands/:id
// @access    Private 'admin'
exports.deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const brand = await BrandModel.findOneAndDelete({ _id: id });
  if (!brand)
    return next(new ApiError(`No brand found with this ID ${id}`, 404));

  res.status(204).send(); // No Content = deleted
});
