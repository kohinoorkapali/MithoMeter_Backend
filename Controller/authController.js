import { User } from "../Model/userModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../security/jwt-utils.js";

// Register
export const register = async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;

    if (!fullname || !username || !email || !password)
      return res.status(400).send({ message: "All fields are required" });

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(409).send({ message: "Email already in use" });

    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername)
      return res.status(409).send({ message: "Username already taken" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullname,
      username,
      email,
      password: hashedPassword,
    });

    const token = generateToken({ id: newUser.id, email: newUser.email });

    const { password: pw, ...userData } = newUser.toJSON();

    res.status(201).send({
      message: "User registered successfully",
      user: userData,
      access_token: token,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).send({ message: "Email and password are required" });

    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(404).send({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).send({ message: "Password is incorrect" });

    const token = generateToken({ id: user.id, email: user.email });

    const { password: pw, ...userData } = user.toJSON();

    res.status(200).send({
      message: "Login successful",
      user: userData,
      access_token: token,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
