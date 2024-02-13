const multer = require("multer");
const uuid = require("uuid").v4; // v4 -- version-4

const upload = multer({
  storage: multer.diskStorage({
    destination: "product-data/images",
    filename: function (req, file, cb) {
      cb(null, uuid() + "-" + file.originalname); // Unique file name with file extension
    },
  }),
}); // upload -- object used to access pre-configured MW that could be added to our routes

const configuredMulterMiddleware = upload.single("image"); // returns a MW function ---  Allows to extract single file by field name from incoming request

module.exports = configuredMulterMiddleware; // But this image would have different/wrong name and extension
