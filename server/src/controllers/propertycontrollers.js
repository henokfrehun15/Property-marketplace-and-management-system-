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
    const property = await updateProperty(
      req.params.id,
      req.body,
      req.user.userId,
      req.user.role
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