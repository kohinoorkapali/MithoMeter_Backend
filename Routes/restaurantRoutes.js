import { deleteById, getAllRestaurants, getRestaurantById, saveRestaurant, updateRestaurantById } from "../Controller/restaurantController.js";
import express from "express";
import upload from "../middleware/uploads.js";

const restaurantRouter = express.Router();

// Route: handle text fields + images
restaurantRouter.post(
  "/",
  upload.array("photos", 5), // field name MUST be "photos"
  saveRestaurant
);

restaurantRouter.patch(
  "/:id",
  upload.array("photos", 5),
  updateRestaurantById
);

restaurantRouter.get("/", getAllRestaurants);
restaurantRouter.get("/:id", getRestaurantById);

restaurantRouter.delete("/:id", deleteById);

export default restaurantRouter;
