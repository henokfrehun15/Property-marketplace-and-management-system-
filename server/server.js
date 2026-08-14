const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const User = require("./src/models/user");
dotenv.config();

const app = express();

connectDB();

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "PropertyHub API is running"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
app.post("/api/test-user", async (req, res) => {
  try {
    const user = await User.create({
      name: "Test User",
      email: "test@propertyhub.com",
      password: "123456"
    });

    res.status(201).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});