import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { connection } from "./Database/db.js";
import { userRouter } from "./Routes/userRoutes.js";
import authRouter from "./Routes/authRoutes.js"; 
import restaurantRouter from "./Routes/restaurantRoutes.js";
import reviewRouter from "./Routes/reviewRoutes.js"; 
import adminRouter from "./Routes/adminRoutes.js"; 

import { createAdminIfNotExists } from "./Model/createAdmin.js";

import "./Model/restaurantModel.js";
import "./Model/userModel.js";
import "./Model/reviewModel.js"; // ← make sure Review model is imported

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
}));

// parse JSON bodies
app.use(express.json());

// Serve uploaded images
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
app.use("/api/reviews", reviewRouter); 
app.use("/api/admin", adminRouter);
// Landing page
app.get("/", (req, res) => res.send("User API is running"));

// Start server
app.listen(5000, () => console.log("Server running on port 5000"));
