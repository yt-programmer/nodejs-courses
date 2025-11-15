const express = require("express");
const {
  getAllUsers,
  register,
  login,
} = require("../controllers/users.controller");
const multer = require("multer");
const appError = require("../utils/appError");
const httpsStatusText = require("../utils/httpsStautsText");
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    const user = "user";
    const filename = `${user + "-" + Date.now()}.${ext}`;
    console.log(filename);
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const imageType = file.mimetype.split("/")[0];
  if (imageType === "image") {
    return cb(null, true);
  } else {
    return cb(
      appError.create("file type is not supported", 400, httpsStatusText.ERROR),
      false
    );
  }
};
const upload = multer({ storage: diskStorage, fileFilter });
const router = express.Router();
const verfiyToken = require("../middleware/verfiyToken");

router.route("/").get(verfiyToken, getAllUsers);
router.route("/register").post(upload.single("avatar"), register);
router.route("/login").post(login);

module.exports = router;
