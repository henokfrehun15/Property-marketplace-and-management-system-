const register = async (req, res) => {
  res.status(201).json({
    success: true,
    message: "User registration controller reached"
  });
};

module.exports = {
  register
};