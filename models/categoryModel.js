const mongoose = require("mongoose");

//! 1. Create schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: "string",
      required: [true, "Category name is required."],
      unique: [true, "Category must be unique."],
      minlength: [3, "Too short category name."],
      maxlength: [32, "Too long category name."],
    },
    slug: {
      type: "string",
      lowercase: true,
    },
    image: {
      type: "string",
    },
  },
  { timestamps: true }
);

//! 2. Create model
const CategoryModel = mongoose.model("Category", categorySchema);

module.exports = CategoryModel;
