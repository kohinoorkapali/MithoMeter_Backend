import { jest } from "@jest/globals";
import { Restaurant, Favorite } from "../../Model/restaurantModel.js";
import * as restaurantController from "../../Controller/restaurantController.js";

jest.mock("../../Model/restaurantModel.js", () => ({
  Restaurant: {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    save: jest.fn(),
    destroy: jest.fn(),
  },
  Favorite: {
    destroy: jest.fn(),
  },
}));

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Restaurant Controller", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should save a new restaurant", async () => {
    const req = {
      body: { name: "Test Resto", location: "City", openTime: "08:00", closeTime: "22:00", description: "Nice place" },
      files: [{ filename: "photo1.png" }],
    };
    const res = mockResponse();
    Restaurant.create.mockResolvedValue(req.body);

    await restaurantController.saveRestaurant(req, res);

    expect(Restaurant.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Restaurant saved successfully" }));
  });
});
