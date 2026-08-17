const { 
    createProperty,
    getAllProperties,
    getPropertyById,
    updateProperty,
    deleteProperty
 } = require("../services/propertyservices");

const create = async (req, res) => {
  try {
    const property = await createProperty(
      req.body,
      req.user.userId
    );

    res.status(201).json({
      success: true,
      message: "Property created successfully",
      property
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
const getAll = async (req, res) => {
  try {
    const result = await getAllProperties(req.query);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch properties"
    });
  }
};
const getProperty = async (req, res) => {
  try {
    const property = await getPropertyById(req.params.id);

    res.status(200).json({
      success: true,
      property
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};
const update = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(error.statusCode || 400).json({
      success: false,
      message: error.message
    });
  }
};
const remove = async (req, res) => {
  try {
    await deleteProperty(
      req.params.id,
      req.user.userId,
      req.user.role
    );

    res.status(200).json({
      success: true,
      message: "Property deleted successfully"
    });
  } catch (error) {
    res.status(error.statusCode || 400).json({
      success: false,
      message: error.message
    });
  }
};
module.exports = {
  create,
  getAll,
  getProperty,
  update,
  remove
};