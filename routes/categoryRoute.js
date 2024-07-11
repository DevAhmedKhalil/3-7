const express = require("express");
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
} = require("../services/categoryService");
const router = express.Router();

//! Routes
router.route("/").get(getCategories).post(createCategory);

router.route("/:id").get(getCategory).put(updateCategory);

module.exports = router;
