const express = require("express");
const { 
    register, 
    login,
    getMe,
    ownerTest  
} = require("../controllers/authcontrollers");
const protect = require("../middleware/authmiddleware");
const authorize = require("../middleware/rolemiddleware");
const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/me",protect, getMe);
router.get("/owner-test", protect, authorize("owner"), ownerTest);
module.exports = router;
