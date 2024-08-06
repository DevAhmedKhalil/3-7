const Factory = require("./handlersFactory");
const BrandModel = require("../models/brandModel");

// @desc      Get a list of brands
// @route     GET /api/v1/brands
// @access    Public 'anyone'
exports.getBrands = Factory.getAll(BrandModel);

// @desc      Get a specific brand by id
// @route     GET /api/v1/brands/:id
// @access    Public 'anyone'
exports.getBrand = Factory.getOne(BrandModel);

// @desc      Create a new brand
// @route     POST /api/v1/brands
// @access    Private 'admin'
exports.createBrand = Factory.createOne(BrandModel);

// @desc      Update category
// @route     PUT /api/v1/brands/:id
// @access    Private 'admin'
exports.updateBrand = Factory.updateOne(BrandModel);

// @desc      Delete brand
// @route     DELETE /api/v1/brands/:id
// @access    Private 'admin'
exports.deleteBrand = Factory.deleteOne(BrandModel);
