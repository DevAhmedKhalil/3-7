const mongoose = require("mongoose");

// Connection with db
const dbConnection = () => {
  mongoose.connect(process.env.DB_URI).then(() => {
    console.log(`MongoDB connected successfully: ${mongoose.connection.host}`);
  });
  // .catch((error) => {
  //   console.log(`Error connecting to MongoDB: ${error}`);
  //   process.exit(1);
  // });
};

module.exports = dbConnection;
