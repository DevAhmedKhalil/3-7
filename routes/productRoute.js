const express = require("express");
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidator");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeProductImages,
} = require("../services/productService");

const authServices = require("../services/authService");

const router = express.Router();

//! Routes
router.route("/").get(getProducts).post(
  // Create product
  authServices.protect,
  authServices.allowedTo("admin", "manager"),
  uploadProductImages,
  resizeProductImages,
  createProductValidator,
  createProduct
);
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    // Update product
    authServices.protect,
    authServices.allowedTo("admin", "manager"),
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct
  )
  .delete(
    // Delete product
    authServices.protect,
    authServices.allowedTo("admin"),
    deleteProductValidator,
    deleteProduct
  );

module.exports = router;
