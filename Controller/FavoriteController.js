import { Favorite } from "../Model/associations.js";

export const FavoriteController = {

  async saveFavorite(req, res) {
    const { userId, restaurantId } = req.body;

    try {
      // Check if already saved
      const exist = await Favorite.findOne({
        where: { userId, restaurantId },
      });

      if (exist) {
        return res.status(400).json({ message: "Already saved" });
      }

      const favorite = await Favorite.create({ userId, restaurantId });
      res.status(200).json({ message: "Saved successfully", favorite });

    } catch (error) {
      res.status(500).json({ message: "Error saving", error });
    }
  },

  async getFavorites(req, res) {
    const { userId } = req.params;

    try {
      const favorites = await Favorite.findAll({
        where: { userId },
        include: ["Restaurant"],
      });
      res.status(200).json(favorites);
    } catch (error) {
      res.status(500).json({ message: "Error fetching", error });
    }
  },

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
