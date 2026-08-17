const express = require("express");

const {
  add,
  getAll,
  remove
} = require("../controllers/favoritecontroller");

const protect = require("../middleware/authmiddleware");

const router = express.Router();

router.post("/:propertyId", protect, add);

router.get("/", protect, getAll);

router.delete("/:propertyId", protect, remove);

module.exports = router;