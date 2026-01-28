// test/restaurantTest/restaurantRoutes.test.js
import request from "supertest";
import express from "express";
import { jest } from "@jest/globals"; // important for ESM

// dummy app
const app = express();
app.use(express.json());

// mock controller functions
const restaurantController = {
  saveRestaurant: jest.fn((req, res) =>
    res.status(201).json({ message: "Restaurant saved successfully" })
  ),
  getAllRestaurants: jest.fn((req, res) =>
    res.status(200).json([{ restaurantId: 1, name: "Resto1" }])
  ),
  getRestaurantById: jest.fn((req, res) =>
    res.status(200).json({ restaurantId: Number(req.params.id), name: "Resto1" })
  ),
  updateRestaurant: jest.fn((req, res) =>
    res.status(200).json({ message: "Restaurant updated successfully", updated: req.body })
  ),
  deleteRestaurant: jest.fn((req, res) =>
    res.status(200).json({ message: "Restaurant deleted successfully" })
  ),
};

// routes
app.post("/api/restaurants", restaurantController.saveRestaurant);
app.get("/api/restaurants", restaurantController.getAllRestaurants);
app.get("/api/restaurants/:id", restaurantController.getRestaurantById);
app.put("/api/restaurants/:id", restaurantController.updateRestaurant);
app.delete("/api/restaurants/:id", restaurantController.deleteRestaurant);

// tests
describe("Restaurant Routes", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should create a restaurant", async () => {
    const res = await request(app)
      .post("/api/restaurants")
      .send({ name: "Test Resto", location: "City" });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message", "Restaurant saved successfully");
    expect(restaurantController.saveRestaurant).toHaveBeenCalled();
  });

  it("should get all restaurants", async () => {
    const res = await request(app).get("/api/restaurants");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(restaurantController.getAllRestaurants).toHaveBeenCalled();
  });

  it("should get restaurant by id", async () => {
    const res = await request(app).get("/api/restaurants/1");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("restaurantId", 1);
    expect(restaurantController.getRestaurantById).toHaveBeenCalled();
  });

  it("should update a restaurant", async () => {
    const res = await request(app)
      .put("/api/restaurants/1")
      .send({ name: "Updated Resto" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Restaurant updated successfully");
    expect(res.body.updated).toHaveProperty("name", "Updated Resto");
    expect(restaurantController.updateRestaurant).toHaveBeenCalled();
  });

  it("should delete a restaurant", async () => {
    const res = await request(app).delete("/api/restaurants/1");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Restaurant deleted successfully");
    expect(restaurantController.deleteRestaurant).toHaveBeenCalled();
  });
});
