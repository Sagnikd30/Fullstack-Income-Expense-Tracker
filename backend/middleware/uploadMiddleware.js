const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File type filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  const isValidType = allowedTypes.includes(file.mimetype);

  if (!isValidType) {
    return cb(
      new Error("Invalid file type. Only JPEG, JPG, and PNG are allowed."),
      false
    );
  }

  if (file.mimetype === "image/gif") {
    return cb(new Error("GIF files are not allowed."), false);
  }

  cb(null, true); 
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 30, // 30 MB
  },
});

module.exports = upload;
