const mongoose = require("mongoose");

//! 1- Create Schema
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

const setImgURL = (doc) => {
  //@ return => image base url + image name
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};

//@ GET [findOne, findAll] and UPDATE
brandSchema.post("init", (doc) => {
  setImgURL(doc);
});

//@ CREATE
brandSchema.post("save", (doc) => {
  setImgURL(doc);
});

//! 2- Create Model
module.exports = mongoose.model("Brand", brandSchema);
