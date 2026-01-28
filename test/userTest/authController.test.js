const authController = require("../../Controller/authController.js");
const { User } = require("../../Model/associations.js");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../../security/jwt-utils.js");


// ===============================
// MOCKS
// ===============================

jest.mock("../../Model/associations.js", () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock("../../security/jwt-utils.js", () => ({
  generateToken: jest.fn(),
}));


// ===============================
// HELPER: MOCK RESPONSE
// ===============================

const mockResponse = () => {
  const res = {};

  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);

  return res;
};


// ===============================
// TESTS
// ===============================

describe("Auth Controller", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });


  // ===========================
  // REGISTER TEST
  // ===========================

  it("should register a new user", async () => {

    const req = {
      body: {
        fullname: "Menuka Rai",
        username: "menuka01",
        email: "menuka@gmail.com",
        password: "Menuka@123",
      },
    };

    const res = mockResponse();


    // No duplicate email/username
    User.findOne.mockResolvedValue(null);

    // Password hash
    bcrypt.hash.mockResolvedValue("hashed-password");


    // DB create
    User.create.mockResolvedValue({
      id: 1,
      fullname: "Menuka Rai",
      username: "menuka01",
      email: "menuka@gmail.com",
      password: "hashed-password",
      role: "user",

      toJSON() {
        return this;
      },
    });


    // JWT
    generateToken.mockReturnValue("fake-token");


    await authController.register(req, res);


    expect(res.status).toHaveBeenCalledWith(201);

    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "User registered successfully",
        role: "user",
        access_token: "fake-token",
      })
    );
  });


  // ===========================
  // LOGIN TEST
  // ===========================

  it("should login user successfully", async () => {

    const req = {
      body: {
        email: "menuka@gmail.com",
        password: "Menuka@123",
      },
    };

    const res = mockResponse();


    // User exists
    User.findOne.mockResolvedValue({
      id: 1,
      email: "menuka@gmail.com",
      password: "hashed-password",
      role: "user",
      status: "active",

      toJSON() {
        return this;
      },
    });


    // Password correct
    bcrypt.compare.mockResolvedValue(true);

    // JWT
    generateToken.mockReturnValue("login-token");


    await authController.login(req, res);


    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Login successful",
        role: "user",
        access_token: "login-token",
      })
    );
  });


  // ===========================
  // LOGIN FAIL: USER NOT FOUND
  // ===========================

  it("should fail if user not found", async () => {

    const req = {
      body: {
        email: "test@gmail.com",
        password: "123",
      },
    };

    const res = mockResponse();


    User.findOne.mockResolvedValue(null);


    await authController.login(req, res);


    expect(res.status).toHaveBeenCalledWith(404);

    expect(res.send).toHaveBeenCalledWith({
      message: "User not found",
    });
  });


  // ===========================
  // LOGIN FAIL: WRONG PASSWORD
  // ===========================

  it("should fail if password is wrong", async () => {

    const req = {
      body: {
        email: "menuka@gmail.com",
        password: "wrongpass",
      },
    };

    const res = mockResponse();


    User.findOne.mockResolvedValue({
      email: "menuka@gmail.com",
      password: "hashed-password",
      status: "active",
    });


    bcrypt.compare.mockResolvedValue(false);


    await authController.login(req, res);


    expect(res.status).toHaveBeenCalledWith(401);

    expect(res.send).toHaveBeenCalledWith({
      message: "Password is incorrect",
    });
  });


  // ===========================
  // LOGIN FAIL: BANNED USER
  // ===========================

  it("should block banned user", async () => {

    const req = {
      body: {
        email: "ban@gmail.com",
        password: "123",
      },
    };

    const res = mockResponse();


    User.findOne.mockResolvedValue({
      email: "ban@gmail.com",
      password: "hashed",
      status: "banned",
    });


    await authController.login(req, res);


    expect(res.status).toHaveBeenCalledWith(403);

    expect(res.json).toHaveBeenCalledWith({
      message: "Your account has been banned. Please contact support.",
    });
  });

});
