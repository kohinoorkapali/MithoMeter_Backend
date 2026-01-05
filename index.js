import express from "express";
import { connection } from "./Database/db.js";
import { userRouter } from "./Routes/userRoutes.js";

const app = express();

connection();

app.use(express.json());


app.use("/api/users", userRouter);

app.get("/", (req, res) => {
  res.send("User API is running");
});


app.listen(5000, () => {
  console.log("Server running on port 5000");
});
