import express from "express";
import cors from "cors";
import path from "path";
import { connection } from "./Database/db.js";
import { userRouter } from "./Routes/userRoutes.js";
import authRouter from "./Routes/authRoutes.js"; 
import restaurantRouter from "./Routes/restaurantRoutes.js";
import reviewRouter from "./Routes/reviewRoutes.js"; 
import favoriteRoutes from "./Routes/favoriteRoutes.js";

import { createAdminIfNotExists } from "./Model/createAdmin.js";

import "./Model/restaurantModel.js";
import "./Model/userModel.js";
import "./Model/reviewModel.js"; 
import "./Model/FavoriteModel.js";


const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PATCH", "DELETE"],
  credentials: true,
}));


app.use(express.json());


app.use("/uploads", express.static(path.resolve("./uploads")));

// DB connection
connection()
  .then(async () => {
    console.log("Database connected");
    await createAdminIfNotExists();
  })
  .catch((err) => console.error("DB connection failed:", err));

// Routes
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/restaurants", restaurantRouter);
app.use("/api/reviews", reviewRouter); // ← register the review routes
app.use("/api/favorites", favoriteRoutes);

// Landing page
app.get("/", (req, res) => res.send("User API is running"));

// Start server
app.listen(5000, () => console.log("Server running on port 5000"));
