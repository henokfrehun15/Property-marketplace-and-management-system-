const Property = require("../models/property");

const createProperty = async (propertyData, ownerId) => {
  const property = await Property.create({
    ...propertyData,
    owner: ownerId
  });

  return property;
};

module.exports = {
  createProperty
};