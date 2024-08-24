const multer = require("multer");

const getExtension = (filename) => {
  const lastDotPosition = filename.lastIndexOf(".");
  if (lastDotPosition === -1) return ""; // No extension found
  if (lastDotPosition === 0) return ""; // File starts with a dot but has no extension (hidden files in Unix-like systems)
  return filename.substring(lastDotPosition + 1);
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp/coverImage");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 100000);
    const extension = getExtension(file.originalname);
    cb(
      null,
      file.fieldname +
        "-" +
        uniqueSuffix +
        (extension.length > 0 ? "." + extension : "")
    );
  },
});

const upload = multer({ storage });
module.exports = upload;
