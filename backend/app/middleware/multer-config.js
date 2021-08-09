"use strict";

const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "image/webp": "webp",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "app/images");
  },
  filename: (req, file, callback) => {
    const generateName = Math.floor(
      Math.random() * Math.pow(10, 10)
    ).toString();
    const extension = MIME_TYPES[file.mimetype];
    if (extension !== undefined) {
      callback(null, String(generateName + Date.now() + "." + extension));
    }
  },
});

module.exports = multer({ storage: storage }).single("image");
