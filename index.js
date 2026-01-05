import express from "express";
import { connection } from "./Database/db.js";
import { userRouter } from "./Routes/userRoutes.js";
import authRouter from "./Routes/authRoutes.js"; 

const app = express();

connection();

app.use(express.json());


app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.send("User API is running");
});


app.listen(5000, () => {
  console.log("Server running on port 5000");
});
