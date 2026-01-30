process.env.NODE_ENV = "test";

import { jest } from "@jest/globals";

/* ================================
   MOCK timeUtils
================================ */

jest.unstable_mockModule("../../utils/timeUtils.js", () => ({
  isRestaurantOpen: jest.fn().mockReturnValue(true),
}));

/* ================================
   MOCK MODEL
================================ */

jest.unstable_mockModule("../../Model/restaurantModel.js", () => ({
  Restaurant: {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  },
}));

/* ================================
   IMPORT AFTER MOCKS
================================ */

const { Restaurant } = await import("../../Model/restaurantModel.js");
const restaurantController = await import(
  "../../Controller/restaurantController.js"
);

/* ================================
   MOCK RESPONSE
================================ */

const mockResponse = () => {
  const res = {};

  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);

  return res;
};

/* ================================
   TESTS
================================ */

describe("Restaurant Controller (minimal)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* ==========================
     ADD RESTAURANT
  =========================== */

  it("should add a restaurant", async () => {
    const req = {
      body: {
        name: "Test Resto",
        location: "City",

        // MUST match controller
        openTime: "09:00",
        closeTime: "22:00",
        description: "Nice place",
      },

      // optional (safe)
      files: [],
    };

    const res = mockResponse();

    Restaurant.create.mockResolvedValue(req.body);

    await restaurantController.saveRestaurant(req, res);

    expect(Restaurant.create).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(201);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Restaurant saved successfully",
      })
    );
  });

  /* ==========================
     GET ALL RESTAURANTS
  =========================== */

  it("should get all restaurants", async () => {
    const res = mockResponse();

    const mockData = [
      {
        restaurantId: 1,
        name: "Resto1",

        openTime: "09:00",
        closeTime: "22:00",

        photos: [],
      },
    ];

    Restaurant.findAll.mockResolvedValue(
      mockData.map((r) => ({
        toJSON: () => r,
      }))
    );

    await restaurantController.getAllRestaurants({}, res);

    expect(Restaurant.findAll).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.arrayContaining([
          expect.objectContaining({
            name: "Resto1",
          }),
        ]),
      })
    );
  });

  /* ==========================
     GET BY ID
  =========================== */

  it("should get restaurant by id", async () => {
    const req = {
      params: { id: 1 },
    };

    const res = mockResponse();

    const mockResto = {
      restaurantId: 1,
      name: "Resto1",

      openTime: "09:00",
      closeTime: "22:00",

      photos: [],
    };

    Restaurant.findOne.mockResolvedValue({
      toJSON: () => mockResto,
    });

    await restaurantController.getRestaurantById(req, res);

    expect(Restaurant.findOne).toHaveBeenCalledWith({
      where: { restaurantId: 1 },
    });

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          name: "Resto1",
        }),
      })
    );
  });
});
