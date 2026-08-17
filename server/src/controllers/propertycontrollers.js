const { 
    createProperty,
    getAllProperties,
    getPropertyById,
    updateProperty,
    deleteProperty
 } = require("../services/propertyservices");

const create = async (req, res) => {
    const property = await createProperty(
      req.body,
      req.user.userId
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
module.exports = {
  create,
  getAll,
  getProperty,
  update,
  remove
};