import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { sequelize } from "./Database/db.js";

import { connection } from "./Database/db.js";

import "./Model/associations.js";

import { userRouter } from "./Routes/userRoutes.js";
import authRouter from "./Routes/authRoutes.js"; 
import restaurantRouter from "./Routes/restaurantRoutes.js";
import reviewRouter from "./Routes/reviewRoutes.js"; 
import favoriteRoutes from "./Routes/favoriteRoutes.js";
import adminRouter from "./Routes/adminRoutes.js"; 
import notificationRouter from "./Routes/notificationRoutes.js"; 
import { PasswordResetToken } from "./Model/passwordResetTokenModel.js";
import { createAdminIfNotExists } from "./Model/createAdmin.js";
import { forgotRouter } from "./Routes/forgotRoutes.js";

import "./Model/restaurantModel.js";
import "./Model/userModel.js";
import "./Model/reviewModel.js"; 
import "./Model/FavoriteModel.js";
import "./Model/reviewLikeModel.js";

import deleteRoutes from "./Routes/deleteRoutes.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
}));


app.use(express.json());

// Serve uploaded images
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/uploads", express.static(path.resolve("./uploads")));


// DB connection
if (process.env.NODE_ENV !== "test") {
connection()
  .then(async () => {
    console.log("Database connected");
    await createAdminIfNotExists();

    // ensure the table exists
    await sequelize.sync({ alter: true });
  })
  .catch((err) => console.error("DB connection failed:", err));
}
// Routes
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/restaurants", restaurantRouter);
app.use("/api/reviews", reviewRouter); // ← register the review routes
app.use("/api/favorites", favoriteRoutes);
app.use("/api/reviews", deleteRoutes);
app.use("/api/admin", adminRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/forgot", forgotRouter);


// Landing page
app.get("/", (req, res) => res.send("User API is running"));

// Start server
if (process.env.NODE_ENV !== "test") {
  app.listen(5000, () => {
    console.log("Server running on port 5000");
  });
}

export default app;

