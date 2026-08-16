const express = require("express");

const { 
    create,
    getAll,
    getProperty,
    update,
    remove
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
router.put(
  "/:id",
  protect,
  authorize("owner", "admin"),
  update
);
router.delete(
  "/:id",
  protect,
  authorize("owner", "admin"),
  remove
);
module.exports = router;