const express = require("express");
const {
  createSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");
const { createSubCategory } = require("../services/subCategoryService");

const router = express.Router();

//! Routes
router.route("/").post(createSubCategoryValidator, createSubCategory);

module.exports = router;
