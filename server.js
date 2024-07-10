const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");

dotenv.config({ path: "config.env" });

//! Connection with db
mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log(`MongoDB connected successfully: ${mongoose.connection.host}`);
  })
  .catch((error) => {
    console.log(`Error connecting to MongoDB: ${error}`);
  });

//! Express app
const app = express();

//! Middlewares
app.use(express.json()); // Middleware for parsing JSON bodies

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`Mode: ${process.env.NODE_ENV}`);
}

//! 1. Create schema
const categorySchema = new mongoose.Schema({
  name: String,
});

//! 2. Create model
const CategoryModel = mongoose.model("Category", categorySchema);

//! Routes
app.post("/", async (req, res, next) => {
  const { name } = req.body;
  console.log(req.body);
  const newCategory = new CategoryModel({ name: name });
  newCategory
    .save()
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.get("/", (req, res) => {
  res.send("Hello World Ahmed");
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
