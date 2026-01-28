import { jest } from "@jest/globals";

// Mock Restaurant completely
jest.unstable_mockModule("../../Model/restaurantModel.js", () => ({
  Restaurant: {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  },
}));

const { Restaurant } = await import("../../Model/restaurantModel.js");
const restaurantController = await import("../../Controller/restaurantController.js");

// Mock response
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Restaurant Controller (minimal)", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should add a restaurant", async () => {
    const req = { body: { name: "Test Resto", location: "City" } };
    const res = mockResponse();
    Restaurant.create.mockResolvedValue(req.body);

    await restaurantController.saveRestaurant(req, res);

    expect(Restaurant.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Restaurant saved successfully" }));
  });

  it("should get all restaurants", async () => {
    const res = mockResponse();
    const mockData = [{ restaurantId: 1, name: "Resto1" }];
    Restaurant.findAll.mockResolvedValue(mockData.map(r => ({ toJSON: () => r })));

    await restaurantController.getAllRestaurants({}, res);

    expect(Restaurant.findAll).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.arrayContaining(mockData));
  });

  it("should get restaurant by id", async () => {
    const req = { params: { id: 1 } };
    const res = mockResponse();
    const mockResto = { restaurantId: 1, name: "Resto1" };
    Restaurant.findOne.mockResolvedValue({ toJSON: () => mockResto });

    await restaurantController.getRestaurantById(req, res);

    expect(Restaurant.findOne).toHaveBeenCalledWith({ where: { restaurantId: 1 } });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining(mockResto));
  });
});
