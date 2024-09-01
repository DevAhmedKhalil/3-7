const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandle = require("express-async-handler");

const Factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const BrandModel = require("../models/brandModel");
const { default: slugify } = require("slugify");

//! Upload single image middleware
exports.uploadBrandImage = uploadSingleImage("image");

//! Image Processing using 'sharp'
exports.resizeImage = asyncHandle(async (req, res, next) => {
  if (!req.file) return next();

  const brand = await BrandModel.findById(req.params.id);

  const filename = `brand-${slugify(brand.name, "_").toLowerCase()}-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/categories/${filename}`); // save image in disk storage

  req.body.image = filename; // save image name in DB

  next();
});

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
