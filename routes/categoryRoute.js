const express = require("express");
const { createCategore } = require("../services/categoryService");
const router = express.Router();

//! Routes
router.post("/", createCategore);

module.exports = router;
