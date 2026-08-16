const { 
    createProperty,
    getAllProperties
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
    const properties = await getAllProperties();

    res.status(200).json({
      success: true,
      count: properties.length,
      properties
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch properties"
    });
  }
};
module.exports = {
  create,
  getAll
};