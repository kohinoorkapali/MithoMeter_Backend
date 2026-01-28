import { jest } from "@jest/globals";

/* ===============================
   MOCKS (BEFORE IMPORTS)
================================ */

jest.unstable_mockModule("../../Model/associations.js", () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

jest.unstable_mockModule("bcryptjs", () => ({
  default: {
    hash: jest.fn(),
    compare: jest.fn(),
  },
}));

jest.unstable_mockModule("../../security/jwt-utils.js", () => ({
  generateToken: jest.fn(),
}));

/* ===============================
   IMPORTS (AFTER MOCKS)
================================ */

const { User } = await import("../../Model/associations.js");

const bcryptModule = await import("bcryptjs");
const bcrypt = bcryptModule.default;

const { generateToken } = await import("../../security/jwt-utils.js");

const authController = await import("../../Controller/authController.js");

/* ===============================
   HELPER
================================ */

const mockResponse = () => {
  const res = {};

  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);

  return res;
};

/* ===============================
   TESTS
================================ */

describe("Auth Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===========================
  // REGISTER
  // ===========================

  it("should register user", async () => {
    const req = {
      body: {
        fullname: "Menuka Rai",
        username: "menuka01",
        email: "menuka@gmail.com",
        password: "Menuka@123",
      },
    };

    const res = mockResponse();

    User.findOne.mockResolvedValue(null);

    bcrypt.hash.mockResolvedValue("hashed");

    User.create.mockResolvedValue({
      id: 1,
      email: "menuka@gmail.com",
      role: "user",
      password: "hashed",

      toJSON() {
        return this;
      },
    });

    generateToken.mockReturnValue("token");

    await authController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  // ===========================
  // LOGIN
  // ===========================

  it("should login user", async () => {
    const req = {
      body: {
        email: "menuka@gmail.com",
        password: "Menuka@123",
      },
    };

    const res = mockResponse();

    User.findOne.mockResolvedValue({
      id: 1,
      email: "menuka@gmail.com",
      password: "hashed",
      role: "user",
      status: "active",

      toJSON() {
        return this;
      },
    });

    bcrypt.compare.mockResolvedValue(true);

    generateToken.mockReturnValue("token");

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });
});
