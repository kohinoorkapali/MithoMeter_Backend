import { Favorite, Restaurant } from "../Model/associations.js";

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
        include: [
          {
            model: Restaurant,
          },
        ],
      });
  
      const normalized = favorites.map((fav) => {
        const data = fav.toJSON();
  
        if (data.Restaurant) {
          let photos = data.Restaurant.photos;
  
          // Parse if string
          if (typeof photos === "string") {
            try {
              photos = JSON.parse(photos);
            } catch {
              photos = [];
            }
          }
  
          if (!Array.isArray(photos)) photos = [];
  
          // Same path as getAllRestaurants
          data.Restaurant.photos = photos.map(
            (filename) => `/uploads/restaurants/${filename}`
          );
        }
  
        return data;
      });
  
      res.status(200).json(normalized);
    } catch (error) {
      console.error("GET FAVORITES ERROR:", error);
      res.status(500).json({ message: "Error fetching favorites" });
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
