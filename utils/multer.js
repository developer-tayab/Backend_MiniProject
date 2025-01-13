const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/uploads')
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(10, (error, hash) => {
      const fileName = hash.toString("hex") + path.extname(file.originalname);
      cb(null, fileName)
    })
  }

})

module.exports = multer({ storage: storage })
