const express = require("express");
const { createCategore } = require("../services/categoryService");
const router = express.Router();

//! Routes
router.get("/", createCategore);

module.exports = router;
