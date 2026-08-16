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
const updateProperty = async (propertyId, updateData, userId, userRole) => {
  const property = await Property.findById(propertyId);

  if (!property) {
    throw new Error("Property not found");
  }

  const isOwner = property.owner.toString() === userId.toString();
  const isAdmin = userRole === "admin";

  if (!isOwner && !isAdmin) {
    const error = new Error(
      "You do not have permission to update this property"
    );

    error.statusCode = 403;
    throw error;
  }

  const updatedProperty = await Property.findByIdAndUpdate(
    propertyId,
    updateData,
    {
      new: true,
      runValidators: true
    }
  ).populate("owner", "name email");

  return updatedProperty;
};
const deleteProperty = async (propertyId, userId, userRole) => {
  const property = await Property.findById(propertyId);

  if (!property) {
    throw new Error("Property not found");
  }

  const isOwner = property.owner.toString() === userId.toString();
  const isAdmin = userRole === "admin";

  if (!isOwner && !isAdmin) {
    const error = new Error(
      "You do not have permission to delete this property"
    );

    error.statusCode = 403;
    throw error;
  }

  await Property.findByIdAndDelete(propertyId);

  return property;
};
module.exports = {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty
};