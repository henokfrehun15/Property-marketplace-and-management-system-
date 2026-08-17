const express = require("express");
const asyncMiddleware = require("../middleware/asyncmiddleware");
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
  asyncMiddleware(create)
);
router.get("/", asyncMiddleware(getAll));
router.get("/:id", asyncMiddleware(getProperty));
router.put(
  "/:id",
  protect,
  authorize("owner", "admin"),
  asyncMiddleware(update)
);
router.delete(
  "/:id",
  protect,
  authorize("owner", "admin"),
  asyncMiddleware(remove)
);
module.exports = router;