const Factory = require("./handlersFactory");
const ProductModel = require("../models/productModel");

// @desc      Get a list of products
// @route     GET /api/v1/products
// @access    Public 'anyone'
exports.getProducts = Factory.getAll(ProductModel, "Products");
// exports.getProducts = asyncHandler(async (req, res) => {
//   //! Build a query
//   const countDocuments = await ProductModel.countDocuments();

//   const apiFeatures = new ApiFeatures(ProductModel.find(), req.query)
//     .paginate(countDocuments)
//     .filter()
//     .sort()
//     .limitFields()
//     .search("Products");

//   //! Execute query
//   const { mongooseQuery, paginationResult } = apiFeatures;
//   const products = await mongooseQuery;

//   res
//     .status(200)
//     .json({ results: products.length, paginationResult, data: products });
// });

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
