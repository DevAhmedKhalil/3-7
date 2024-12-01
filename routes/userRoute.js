const express = require("express");
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
} = require("../utils/validators/userValidator");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  changeUserPassword,
} = require("../services/userService");

const authServices = require("../services/authService");

const router = express.Router();

//! Routes
router.put(
  "/changePassword/:id",
  changeUserPasswordValidator,
  changeUserPassword
);
router
  .route("/")
  .get(
    // Get all users
    authServices.protect,
    authServices.allowedTo("admin", "manager"),
    getUsers
  )
  .post(
    // Create user
    authServices.protect,
    authServices.allowedTo("admin"),
    uploadUserImage,
    resizeImage,
    createUserValidator,
    createUser
  );
router
  .route("/:id")
  .get(
    // Get specific user
    authServices.protect,
    authServices.allowedTo("admin"),
    getUserValidator,
    getUser
  )
  .put(
    // Update user
    authServices.protect,
    authServices.allowedTo("admin"),
    uploadUserImage,
    resizeImage,
    updateUserValidator,
    updateUser
  )
  .delete(
    // Delete user
    authServices.protect,
    authServices.allowedTo("admin"),
    deleteUserValidator,
    deleteUser
  );

module.exports = router;
