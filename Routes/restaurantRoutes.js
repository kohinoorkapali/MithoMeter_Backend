import express from "express";
import {
  saveRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurantById,
  deleteById,
} from "../Controller/restaurantController.js";

import { restaurantUploader } from "../middleware/uploads.js";

const restaurantRouter = express.Router();

// CREATE
restaurantRouter.post(
  "/",
  restaurantUploader.array("photos", 5),
  saveRestaurant
);

// GET ALL
restaurantRouter.get("/", getAllRestaurants);

// GET ONE
restaurantRouter.get("/:id", getRestaurantById);

// UPDATE
restaurantRouter.patch(
  "/:id",
  restaurantUploader.array("photos", 5),
  updateRestaurantById
);

// DELETE
restaurantRouter.delete("/:id", deleteById);

export default restaurantRouter;
