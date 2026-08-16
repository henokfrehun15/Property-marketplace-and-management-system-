const express = require("express");

const { 
    create,
    getAll
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
module.exports = router;