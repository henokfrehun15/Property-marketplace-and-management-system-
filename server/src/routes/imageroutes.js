const express = require("express");

const {
  upload
} = require("../controllers/imagecontroller");
const authorize = require("../middleware/rolemiddleware");
const protect = require("../middleware/authmiddleware");
const asyncMiddleware = require("../middleware/asyncmiddleware");
const uploadMiddleware = require("../middleware/uploadmiddleware");


const router = express.Router();

router.post(
  "/",
  protect,
  authorize("admin", "owner"),
  uploadMiddleware.single("image"),
  asyncMiddleware(upload)
);

module.exports = router;