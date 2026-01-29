// test/restaurantTest/restaurantRoutes.test.js
import request from "supertest";
import express from "express";
import { jest } from "@jest/globals";

// dummy app
const app = express();
app.use(express.json());

// mock restaurant controller (same style as review routes)
const restaurantController = {
  addRestaurant: jest.fn((req, res) =>
    res.status(201).json({
      success: true,
      data: req.body,
    })
  ),

  getAllRestaurants: jest.fn((req, res) =>
    res.status(200).json({
      success: true,
      data: [
        {
          restaurantId: 1,
          name: "Test Resto",
          location: "City",
        },
      ],
    })
  ),

  getRestaurantById: jest.fn((req, res) =>
    res.status(200).json({
      success: true,
      data: {
        restaurantId: Number(req.params.id),
        name: "Test Resto",
      },
    })
  ),

  updateRestaurant: jest.fn((req, res) =>
    res.status(200).json({
      success: true,
      message: "Restaurant updated",
      data: {
        restaurantId: Number(req.params.id),
        ...req.body,
      },
    })
  ),

  deleteRestaurant: jest.fn((req, res) =>
    res.status(200).json({
      success: true,
      message: "Restaurant deleted",
    })
  ),
};

// routes
app.post("/api/restaurants", restaurantController.addRestaurant);
app.get("/api/restaurants", restaurantController.getAllRestaurants);
app.get("/api/restaurants/:id", restaurantController.getRestaurantById);
app.put("/api/restaurants/:id", restaurantController.updateRestaurant);
app.delete("/api/restaurants/:id", restaurantController.deleteRestaurant);

// tests
describe("Basic Restaurant Routes", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should add a restaurant", async () => {
    const dummyRestaurant = {
      name: "Test Resto",
      location: "City",
    };

    const res = await request(app).post("/api/restaurants").send(dummyRestaurant);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject(dummyRestaurant);
    expect(restaurantController.addRestaurant).toHaveBeenCalled();
  });

  it("should get all restaurants", async () => {
    const res = await request(app).get("/api/restaurants");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(restaurantController.getAllRestaurants).toHaveBeenCalled();
  });

  it("should get restaurant by id", async () => {
    const res = await request(app).get("/api/restaurants/1");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("restaurantId", 1);
    expect(restaurantController.getRestaurantById).toHaveBeenCalled();
  });

  it("should update a restaurant", async () => {
    const res = await request(app)
      .put("/api/restaurants/1")
      .send({ name: "Updated Resto" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("name", "Updated Resto");
    expect(restaurantController.updateRestaurant).toHaveBeenCalled();
  });

  it("should delete a restaurant", async () => {
    const res = await request(app).delete("/api/restaurants/1");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty("message", "Restaurant deleted");
    expect(restaurantController.deleteRestaurant).toHaveBeenCalled();
  });
});
