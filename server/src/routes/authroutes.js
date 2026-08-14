const express = require("express");
const { 
    register, 
    login,
    getMe
} = require("../controllers/authcontrollers");
const protect = require("../middleware/authmiddleware");
const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/me",protect, getMe);
module.exports = router;
