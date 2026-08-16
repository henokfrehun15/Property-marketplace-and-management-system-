const express = require("express");

const { 
    create,
    getAll,
    getProperty
 } = require("../controllers/propertycontrollers");

const protect = require("../middleware/authmiddleware");
const authorize = require("../middleware/rolemiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("owner", "admin"),
  create
);
router.get("/", getAll);
router.get("/:id", getProperty);
module.exports = router;