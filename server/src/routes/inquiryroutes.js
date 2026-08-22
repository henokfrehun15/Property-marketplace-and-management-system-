const express = require("express");

const {
  create,
  getSent,
  getReceived,
  updateStatus,
  reply 
} = require("../controllers/inquirycontroller");

const protect = require("../middleware/authmiddleware");
const asyncMiddleware = require("../middleware/asyncmiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  asyncMiddleware(create)
);
router.get(
  "/sent",
  protect,
  asyncMiddleware(getSent)
);
router.get(
  "/received",
  protect,
  asyncMiddleware(getReceived)
);
router.patch(
  "/:id/status",
  protect,
  asyncMiddleware(updateStatus)
);
router.patch(
  "/:id/reply",
  protect,
  asyncMiddleware(reply)
);
module.exports = router;