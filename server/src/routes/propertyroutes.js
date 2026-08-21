const express = require("express");

const uploadMiddleware = require("../middleware/uploadmiddleware");
const asyncMiddleware = require("../middleware/asyncmiddleware");

const {
  create,
  getAll,
  getProperty,
  update,
  remove,
  getMyProperties
} = require("../controllers/propertycontrollers");

const protect = require("../middleware/authmiddleware");
const authorize = require("../middleware/rolemiddleware");

const router = express.Router();


// ===============================
// CREATE PROPERTY
// ===============================

router.post(
  "/",
  protect,
  authorize("owner", "admin"),
  uploadMiddleware.array("images", 10),
  asyncMiddleware(create)
);


// ===============================
// GET ALL PROPERTIES
// ===============================

router.get(
  "/",
  asyncMiddleware(getAll)
);


// ===============================
// GET MY PROPERTIES
// ===============================

router.get(
  "/my-properties",
  protect,
  authorize("owner", "admin"),
  asyncMiddleware(getMyProperties)
);


// ===============================
// GET PROPERTY BY ID
// ===============================

router.get(
  "/:id",
  asyncMiddleware(getProperty)
);


// ===============================
// UPDATE PROPERTY
// ===============================

router.put(
  "/:id",
  protect,
  authorize("owner", "admin"),
  uploadMiddleware.array("images", 10),
  asyncMiddleware(update)
);


// ===============================
// DELETE PROPERTY
// ===============================

router.delete(
  "/:id",
  protect,
  authorize("owner", "admin"),
  asyncMiddleware(remove)
);


module.exports = router;