const {
  uploadImage
} = require("../services/imageservices");

const upload = async (req, res) => {
  const result = await uploadImage(req.file);

  res.status(201).json({
    success: true,
    message: "Image uploaded successfully",
    image: result
  });
};

module.exports = {
  upload
};