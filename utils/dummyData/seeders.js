const fs = require("fs");
require("colors");
const dotenv = require("dotenv");
const ProductModel = require("../../models/productModel");
const dbConnection = require("../../config/database");

dotenv.config({ path: "../../config.env" });

// connect to DB
dbConnection();

// Read data
const products = JSON.parse(fs.readFileSync("./products.json", "utf-8"));

// Insert data into DB
const insertData = async () => {
  try {
    await ProductModel.create(products);
    console.log("Data Inserted Successfully".green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Delete data from DB
const destroyData = async () => {
  try {
    await ProductModel.deleteMany();
    console.log("Data Destroyed Successfully".red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// node seeder.js -i
if (process.argv[2] === "-i") {
  insertData();
}
// node seeder.js -d
else if (process.argv[2] === "-d") {
  destroyData();
}
