const { createProperty } = require("../services/propertyservices");

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

module.exports = {
  create
};