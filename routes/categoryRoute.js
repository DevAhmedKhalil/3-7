const express = require("express");
const {
  getCategories,
  createCategory,
} = require("../services/categoryService");
const router = express.Router();

//! Routes
router.route("/").get(getCategories).post(createCategory);

module.exports = router;
