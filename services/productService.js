const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandle = require("express-async-handler");

const Factory = require("./handlersFactory");
const ProductModel = require("../models/productModel");
const { uploadMixOfImages } = require("../middlewares/uploadImageMiddleware");

exports.uploadProductImages = uploadMixOfImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

//! Image Processing using 'sharp'
exports.resizeProductImages = asyncHandle(async (req, res, next) => {
  // console.log("✌️ REQ.FILES = ", req.files);

  //* 1- Image processing for imageCover
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverFileName}`);

    // Save image into our db
    req.body.imageCover = imageCoverFileName;
  }

  //* 2- Image processing for images array
  if (req.files.images) {
    req.body.images = [];

    //? map func not return promise it can't wait for loop to finish
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imageName}`);

        // Save each image into our db
        req.body.images.push(imageName);
      })
    );
    // console.log(req.body.imageCover);
    // console.log(req.body.images);
  }

  next();
});

// @desc      Get a list of products
// @route     GET /api/v1/products
// @access    Public 'anyone'
exports.getProducts = Factory.getAll(ProductModel, "Products");

// @desc      Get a specific product by id
// @route     GET /api/v1/products/:id
// @access    Public 'anyone'
exports.getProduct = Factory.getOne(ProductModel);

// @desc      Create a new product
// @route     POST /api/v1/products
// @access    Private 'admin'
exports.createProduct = Factory.createOne(ProductModel);

// @desc      Update product
// @route     PUT /api/v1/products/:id
// @access    Private 'admin'
exports.updateProduct = Factory.updateOne(ProductModel);

// @desc      Delete product
// @route     DELETE /api/v1/products/:id
// @access    Private 'admin'
exports.deleteProduct = Factory.deleteOne(ProductModel);
