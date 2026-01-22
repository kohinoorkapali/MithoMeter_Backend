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

export const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findOne({
      where: { restaurantId: id },
    });

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    res.status(200).json({
      data: restaurant,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const updateRestaurantById = async (req, res) => {
  console.log(" PATCH HIT");
  console.log(" BODY:", req.body);
  console.log(" FILES:", req.files);

  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findByPk(id);
    if (!restaurant) {
      return res.status(404).json({ message: "Not found" });
    }
        
    // Existing photos
    let existingPhotos = [];
    if (req.body.existingPhotos) {
      existingPhotos = JSON.parse(req.body.existingPhotos).map(p =>
        p.replace(/\\/g, "/").replace(/^.*\/uploads\//, "uploads/")
      );
    }

    // New uploads
    let newPhotos = [];
    if (req.files?.length) {
      newPhotos = req.files.map(file =>
        file.path
          .replace(/\\/g, "/")
          .replace(/^.*\/uploads\//, "uploads/")
      );
    }

    // Merge photos
    restaurant.photos = [...existingPhotos, ...newPhotos];

    // Update other fields
    restaurant.name = req.body.name;
    restaurant.location = req.body.location;
    restaurant.openTime = req.body.openTime;
    restaurant.closeTime = req.body.closeTime;
    restaurant.description = req.body.description;
    restaurant.websiteLink = req.body.websiteLink;
    restaurant.menuLink = req.body.menuLink;

    restaurant.cuisines = JSON.parse(req.body.cuisines);
    restaurant.priceRange = JSON.parse(req.body.priceRange);
    restaurant.moods = JSON.parse(req.body.moods);
    restaurant.features = JSON.parse(req.body.features);

    console.log("FINAL PHOTOS TO SAVE:", restaurant.photos);

    await restaurant.save();

    res.json({ message: "Restaurant updated successfully" });
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};



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
