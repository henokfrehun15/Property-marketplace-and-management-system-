const cloudinary = require("../config/cloudinary");
const AppError = require("../utils/appError");

const uploadImage = async (file) => {
  if (!file) {
    throw new AppError("Image file is required", 400);
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "propertyhub/properties",
        resource_type: "image"
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id
        });
      }
    );

    stream.end(file.buffer);
  });
};
const uploadImages = async (files) => {
  if (!files || files.length === 0) {
    return [];
  }

  const uploadPromises = files.map((file) => {
    return uploadImage(file);
  });

  const results = await Promise.all(uploadPromises);

  return results;
};
module.exports = {
  uploadImage,
  uploadImages
};