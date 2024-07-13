const mongoose = require("mongoose");

//! 1. Create schema
const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: "string",
      required: [true, "Subcategory name is required."],
      unique: [true, "Subcategory must be unique."],
      minlength: [2, "Too short subcategory name."],
      maxlength: [32, "Too long subcategory name."],
    },
    slug: {
      type: "string",
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Subcategory must be refered to parent Category."],
    },
  },
  { timestamps: true }
);

//! 2. Create model
const subCategoryModel = mongoose.model("subCategory", subCategorySchema);

module.exports = subCategoryModel;
