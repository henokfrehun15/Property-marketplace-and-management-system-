const express = require("express");

const router = express.Router();

router.post("/register", (req, res) => {
  res.json({
    success: true,
    message: "Registration endpoint reached"
  });
});

module.exports = router;