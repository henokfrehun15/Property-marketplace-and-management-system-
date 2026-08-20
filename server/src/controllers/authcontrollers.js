const User = require("../models/user");
const { 
    registerUser,
    loginUser
 } = require("../services/authservices");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await registerUser({
      name,
      email,
      password
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user:{
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { user, token } = await loginUser({
      email,
      password
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
const ownerTest = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "You are authorized as an owner",
    user: req.user
  });
};
module.exports = {
  register,
  login,      
  getMe,
  ownerTest
};