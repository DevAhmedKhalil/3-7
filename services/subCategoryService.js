const Factory = require("./handlersFactory");
const SubCategoryModel = require("../models/subCategoryModel");

exports.setCategoryIdToBody = (req, res, next) => {
  //@ for nested route => (Create case)
  if (!req.body.category) {
    req.body.category = req.params.categoryId;
  }
  next();
};

exports.createFilterObj = (req, res, next) => {
  //@ for nested route => (Get case)
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
exports.getSubCategories = Factory.getAll(SubCategoryModel);

// @desc      Get a specific subCategory by id
// @route     GET /api/v1/subcategories/:id
// @access    Public 'anyone'
exports.getSubCategory = Factory.getOne(SubCategoryModel);

// @desc      Create a new subCategory
// @route     POST /api/v1/subCategory
// @access    Private 'admin'
exports.createSubCategory = Factory.createOne(SubCategoryModel);

// @desc      Update subCategory
// @route     PUT /api/v1/subcategory/:id
// @access    Private 'admin'
exports.updateSubCategory = Factory.updateOne(SubCategoryModel);

// @desc      Delete subCategory
// @route     DELETE /api/v1/subcategory/:id
// @access    Private 'admin'
exports.deleteSubCategory = Factory.deleteOne(SubCategoryModel);
