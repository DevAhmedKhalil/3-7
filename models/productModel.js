const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
      required: [true, "Title is required!"],
      trim: true,
      minlength: [3, "Title should not be less than 3 characters!"],
      maxlength: [100, "Title should not exceed 100 characters!"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product Description is required!"],
      trim: true,
      minlength: [10, "Description should not be less than 10 characters!"],
      maxlength: [2000, "Description should not exceed 500 characters!"],
    },
    quantity: {
      type: Number,
      required: [true, "Product Quantity is required!"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Product Price is required!"],
      trim: true,
      max: [1000000, "Too long Price should be less than 20 numbers!"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, "Product Image Cover is required!"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product must be categorized!"],
    },
    subCategory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must be at most 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
