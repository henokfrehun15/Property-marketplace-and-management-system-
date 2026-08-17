const Favorite = require("../models/favorite");
const Property = require("../models/property");

const addFavorite = async (userId, propertyId) => {
  const property = await Property.findById(propertyId);

  if (!property) {
    throw new Error("Property not found");
  }

  const existingFavorite = await Favorite.findOne({
    user: userId,
    property: propertyId
  });

  if (existingFavorite) {
    throw new Error("Property is already in your favorites");
  }

  const favorite = await Favorite.create({
    user: userId,
    property: propertyId
  });

  return favorite;
};
const getFavorites = async (userId) => {
  const favorites = await Favorite.find({
    user: userId
  })
    .populate("property")
    .sort({ createdAt: -1 });

  return favorites;
};
const removeFavorite = async (userId, propertyId) => {
  const favorite = await Favorite.findOneAndDelete({
    user: userId,
    property: propertyId
  });

  if (!favorite) {
    throw new Error("Favorite not found");
  }

  return favorite;
};
module.exports = {
  addFavorite,
  getFavorites,
  removeFavorite
};