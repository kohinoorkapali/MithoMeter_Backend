import { Favorite } from "../Model/FavoriteModel.js";
import { Restaurant } from "../Model/restaurantModel.js";

export const FavoriteController = {
  async saveFavorite(req, res) {
  const { userId, restaurantId } = req.body;

  if (!userId || !restaurantId) {
    return res.status(400).json({ message: "Missing userId or restaurantId" });
  }

  try {
    const [favorite, created] = await Favorite.findOrCreate({
      where: { userId, restaurantId },
    });

    return res.status(200).json({
      message: created ? "Saved successfully" : "Already saved",
      favorite,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error saving", error });
  }
},



  // Get all favorite restaurants for a user
async getFavorites(req, res) {
  const { userId } = req.params;

  try {
    const favorites = await Favorite.findAll({
      where: { userId },
      include: [{ model: Restaurant }], // not string
    });
    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json({ message: "Error fetching", error });
  }
},


  // Remove a restaurant from favorites
  async deleteFavorite(req, res) {
    const { userId, restaurantId } = req.params;

    try {
      const deleted = await Favorite.destroy({
        where: { userId, restaurantId },
      });

      if (!deleted) {
        return res.status(404).json({ message: "Not found" });
      }

      res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting", error });
    }
  },
};
