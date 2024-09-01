const multer = require("multer");
const ApiError = require("../utils/apiError");

exports.uploadSingleImage = (fieldName) => {
  // //! 1- Disk Storage Engine
  // const multerStorage = multer.diskStorage({
  //   destination: (req, file, cb) => {
  //     cb(null, "uploads/categories");
  //   },
  //   filename: (req, file, cb) => {
  //     const ext = file.mimetype.split("/")[1];
  //     const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
  //     cb(null, filename);
  //   },
  // });

  //! 2- Memory Storage Engine
  const multerStorage = multer.memoryStorage(); // memoryStorage Has Buffer

  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new ApiError("Not an image!", 400), false);
    }
  };

  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

  return upload.single(fieldName);
};
