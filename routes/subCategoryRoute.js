const express = require("express");
const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");
const {
  createSubCategory,
  getSubCategory,
  getSubCategories,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
  createFilterObj,
} = require("../services/subCategoryService");

const authServices = require("../services/authService");

// mergeParams: Allow us to merge parameters in other routers
// ex: We need to access categoryId from category router
const router = express.Router({ mergeParams: true });

//! Routes
router
  .route("/")
  .post(
    // Create subcategory
    authServices.protect,
    authServices.allowedTo("admin", "manager"),
    setCategoryIdToBody,
    createSubCategoryValidator,
    createSubCategory
  )
  .get(createFilterObj, getSubCategories);
router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(
    // Update subcategory
    authServices.protect,
    authServices.allowedTo("admin", "manager"),
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    // Delete subcategory
    authServices.protect,
    authServices.allowedTo("admin", "manager"),
    deleteSubCategoryValidator,
    deleteSubCategory
  );

module.exports = router;
