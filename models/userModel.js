const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      minlength: [3, "Name should not be less than 3 characters."],
      maxlength: [50, "Name should not exceed 50 characters."],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: [true, "The email is already exists."],
      // match: [
      //   /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      //   "Please enter a valid email address.",
      // ],
    },
    phone: {
      type: String,
      // required: [true, "Phone number is required."],
    },
    profileImg: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [8, "Password should not be less than 8 characters."],
      // select: false, //Is used to exclude this field from being returned in query results by default
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Pre-save hook for password hashing
userSchema.pre("save", async function (next) {
  // Only hash the password if it's new or modified
  if (!this.isModified("password")) return next();

  // Hash password with salt
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
