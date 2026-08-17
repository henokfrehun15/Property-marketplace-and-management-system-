const {
  addFavorite,
  getFavorites,
  removeFavorite
} = require("../services/favoriteservices");

const add = async (req, res) => {
  try {
    const favorite = await addFavorite(
      req.user.userId,
      req.params.propertyId
    );

    res.status(201).json({
      success: true,
      message: "Property added to favorites",
      favorite
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
    const favorites = await getFavorites(
      req.user.userId
    );

    res.status(200).json({
      success: true,
      count: favorites.length,
      favorites
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch favorites"
    });
  }
};
const remove = async (req, res) => {
  try {
    await removeFavorite(
      req.user.userId,
      req.params.propertyId
    );

    res.status(200).json({
      success: true,
      message: "Property removed from favorites"
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};
module.exports = {
  add,
  getAll,
  remove
};