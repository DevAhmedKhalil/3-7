const express = require("express");
const { param, validationResult } = require("express-validator");

const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../services/categoryService");
const router = express.Router();

//! Routes
router.route("/").get(getCategories).post(createCategory);

router
  .route("/:id")
  .get(
    // 1- Rules
    param("id").isMongoId().withMessage("Invalid ID."),
    // 2- Middleware --> Catch errors from Rules if exists
    (req, res) => {
      const result = validationResult(req);
      if (result.isEmpty()) {
        return res.send(`Hello, ${req.query.person}!`);
      }

      res.status(400).send({ errors: result.array() });
    },
    getCategory
  )
  .put(updateCategory)
  .delete(deleteCategory);

module.exports = router;
