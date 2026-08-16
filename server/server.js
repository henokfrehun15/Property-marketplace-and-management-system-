const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const authroutes = require("./src/routes/authroutes");
const propertyRoutes = require("./src/routes/propertyroutes");
dotenv.config();

const app = express();

connectDB();
app.use(express.json());
app.use("/api/auth", authroutes);
app.use("/api/properties", propertyRoutes);
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
