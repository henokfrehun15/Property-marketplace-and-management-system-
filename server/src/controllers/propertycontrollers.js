const { 
    createProperty,
    getAllProperties,
    getPropertyById,
    updateProperty,
    deleteProperty,
    getMyProperties: getMyPropertiesservice
 } = require("../services/propertyservices");
const {uploadImages} = require("../services/imageservices");
const create = async (req, res) => {
  const uploadedImages = await uploadImages(req.files);

  const propertyImages = uploadedImages.map(image => ({
    url: image.url,
    publicId: image.publicId
  }));

  let location;

  try {
    location = JSON.parse(req.body.location);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid location format"
    });
  }

  const propertyData = {
    ...req.body,
    location,
    area: Number(req.body.area),
    price: Number(req.body.price),
    bedrooms: Number(req.body.bedrooms),
    bathrooms: Number(req.body.bathrooms)
  };

  const property = await createProperty(
    propertyData,
    req.user.userId,
    propertyImages
  );

  res.status(201).json({
    success: true,
    message: "Property created successfully",
    property
  });
};
const getAll = async (req, res) => {
    const result = await getAllProperties(req.query);

    res.status(200).json({
      success: true,
      ...result
    });
};
const getProperty = async (req, res) => {
    const property = await getPropertyById(req.params.id);

    res.status(200).json({
      success: true,
      property
    });
};
const update = async (req, res) => {
  let updateData = { ...req.body };

  // Parse location if it was sent as JSON
  if (req.body.location) {
    try {
      updateData.location =
        typeof req.body.location === "string"
          ? JSON.parse(req.body.location)
          : req.body.location;
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid location format"
      });
    }
  }


  // Convert numbers
  if (req.body.price !== undefined) {
    updateData.price = Number(req.body.price);
  }

  if (req.body.bedrooms !== undefined) {
    updateData.bedrooms = Number(req.body.bedrooms);
  }

  if (req.body.bathrooms !== undefined) {
    updateData.bathrooms = Number(req.body.bathrooms);
  }

  if (req.body.area !== undefined) {
    updateData.area = Number(req.body.area);
  }

  // Existing images that user wants removed
  let removedImages = [];

  if (req.body.removedImages) {
    try {
      removedImages =
        typeof req.body.removedImages === "string"
          ? JSON.parse(req.body.removedImages)
          : req.body.removedImages;
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid removedImages format"
      });
    }
  }
  const newImages = req.files || [];
  const property = await updateProperty(
    req.params.id,
    updateData,
    req.user.userId,
    req.user.role,
    newImages,
    removedImages
  );

  res.status(200).json({
    success: true,
    message: "Property updated successfully",
    property
  });
};
const remove = async (req, res) => {
    await deleteProperty(
      req.params.id,
      req.user.userId,
      req.user.role
    );

    res.status(200).json({
      success: true,
      message: "Property deleted successfully"
    });
};
const getMyProperties = async (req, res) => {
  try {
    const properties = await getMyPropertiesservice(
      req.user.userId
    );

    res.status(200).json({
      success: true,
      count: properties.length,
      properties
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch your properties"
    });
  }
};
module.exports = {
  create,
  getAll,
  getProperty,
  update,
  remove,
  getMyProperties
};