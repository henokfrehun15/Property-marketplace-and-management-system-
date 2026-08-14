const { registerUser } = require("../services/authservices");

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

module.exports = {
  register
};