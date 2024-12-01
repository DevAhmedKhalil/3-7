const express = require("express");
const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validators/brandValidator");
const {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeImage,
} = require("../services/brandService");

const authServices = require("../services/authService");

const router = express.Router();

//! Routes
router.route("/").get(getBrands).post(
  // Create brand
  authServices.protect,
  authServices.allowedTo("admin", "manager"),
  uploadBrandImage,
  resizeImage,
  createBrandValidator,
  createBrand
);
router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(
    // Update brand
    authServices.protect,
    authServices.allowedTo("admin", "manager"),
    uploadBrandImage,
    resizeImage,
    updateBrandValidator,
    updateBrand
  )
  .delete(
    // Delete brand
    authServices.protect,
    authServices.allowedTo("admin"),
    deleteBrandValidator,
    deleteBrand
  );

module.exports = router;
