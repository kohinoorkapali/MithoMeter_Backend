import { User } from "../Model/userModel.js";


export const getAll = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).send({
      data: users,
      message: "Users retrieved successfully",
    });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

export const save = async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;

    if (!fullname || !username || !email || !password) {
      return res.status(400).send({
        message: "All fields are required",
      });
    }

    const user = await User.create({
      fullname,
      username,
      email,
      password,
    });

    res.status(201).send({
      data: user,
      message: "User saved successfully",
    });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

export const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ where: { id } });

    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    res.status(200).send({
      data: user,
      message: "User fetched successfully",
    });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

export const updateById = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullname, username, email, password } = req.body;

    const user = await User.findOne({ where: { id } });

    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    user.fullname = fullname ?? user.fullname;
    user.username = username ?? user.username;
    user.email = email ?? user.email;
    user.password = password ?? user.password;

    await user.save();

    res.status(200).send({
      data: user,
      message: "User updated successfully",
    });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

export const deleteById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ where: { id } });

    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    await user.destroy();

    res.status(200).send({
      message: "User deleted successfully",
    });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};
