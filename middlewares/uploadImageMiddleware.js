const multer = require("multer");
const ApiError = require("../utils/apiError");

const multerOptions = () => {
  //! Memory Storage Engine
  const multerStorage = multer.memoryStorage(); // memoryStorage Has Buffer

  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new ApiError("Not an image!", 400), false);
    }
  };

  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

  return upload;
};

//* Upload Single Image
exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);

//* Upload Multiple Images
exports.uploadMixOfImages = (arrayOfFields) =>
  multerOptions().fields(arrayOfFields);
