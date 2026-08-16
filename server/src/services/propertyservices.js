const Property = require("../models/property");

const createProperty = async (propertyData, ownerId) => {
  const property = await Property.create({
    ...propertyData,
    owner: ownerId
  });

  return property;
};
const getAllProperties = async () => {
  const properties = await Property.find({
    status: "available"
  })
    .populate("owner", "name email")
    .sort({ createdAt: -1 });

  return properties;
};
const getPropertyById = async (propertyId) => {
  const property = await Property.findById(propertyId)
    .populate("owner", "name email");

  if (!property) {
    throw new Error("Property not found");
  }

  return property;
};
module.exports = {
  createProperty,
  getAllProperties,
  getPropertyById
};