import { User } from "../Model/userModel.js";

export const getAll = async (req, res) => {
  try {
    const users = await User.findAll({
      where: {role: "user"},
      attributes: [
        "id",
        "username",
        "email",
        "profileImage",
        "createdAt",
        "status"
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ data: users });
  } catch (err) {
    console.error("GET USERS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({
      where: {id, role: "user"},
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newStatus = user.status === "banned" ? "active" : "banned";
    await user.update({status :newStatus});

    res.status(200).json({
      status: newStatus,
      message: `User ${
        newStatus === "banned" ? "banned" : "unbanned"
      } successfully`,
    });
    
  } catch (err) {
    console.error("TOGGLE USER STATUS ERROR:", err);
    res.status(500).json({ message: err.message });
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
    const { username } = req.body;

    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Only allow username update
    if (username) user.username = username;

    await user.save();

    res.status(200).send({
      data: user,
      message: "Profile updated successfully",
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
export const updateProfileWithImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body;
    const profileImage = req.file?.filename;

    const user = await User.findOne({ where: { id } });
    if (!user) return res.status(404).send({ message: "User not found" });

    // Only update username if non-empty
    if (username && username.trim() !== "") {
      user.username = username;
    }

    // Only update profile_image if file uploaded
    if (profileImage) {
      user.profile_image = profileImage;
    }

    await user.save();

    res.status(200).send({
      data: user,
      message: "Profile updated successfully",
    });
  } catch (err) {
    console.error(err); // log the exact error
    res.status(500).send({ message: err.message });
  }
};
