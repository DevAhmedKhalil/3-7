const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: "string",
      required: [true, "Brand name is required."],
      unique: [true, "Brand must be unique."],
      minlength: [3, "Too short Brand name."],
      maxlength: [32, "Too long Brand name."],
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

module.exports = mongoose.model("Brand", brandSchema);
