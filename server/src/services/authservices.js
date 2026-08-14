const bcrypt = require("bcryptjs");
const User = require("../models/user");

const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }
  const hashedpassword = await bcrypt.hash(password, 12);
  
  const user = await User.create({
    name,
    email,
    password: hashedpassword
  });

  return user;
};

module.exports = {
  registerUser
};