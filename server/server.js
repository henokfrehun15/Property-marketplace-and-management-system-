require("dotenv").config();
const express = require("express");
const connectDB = require("./src/config/db");
const authroutes = require("./src/routes/authroutes");
const propertyRoutes = require("./src/routes/propertyroutes");
const favoriteRoutes = require("./src/routes/favoriteroutes");
const errorMiddleware = require("./src/middleware/errormiddleware");
const inquiryRoutes = require("./src/routes/inquiryroutes");
const imageRoutes = require("./src/routes/imageroutes");


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
app.use("/api/favorites", favoriteRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/images", imageRoutes);
app.use(errorMiddleware);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
