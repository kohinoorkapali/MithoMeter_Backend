import express from "express";
import { FavoriteController } from "../Controller/FavoriteController.js";

const router = express.Router();

router.post("/save", FavoriteController.saveFavorite);
router.get("/:userId", FavoriteController.getFavorites);
router.delete("/:userId/:restaurantId", FavoriteController.deleteFavorite);

export default router;
