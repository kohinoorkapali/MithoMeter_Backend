import bcrypt from "bcryptjs";
import { User } from "./userModel.js";

export const createAdminIfNotExists = async () => {
  const adminEmail = "admin@gmail.com";

  const admin = await User.findOne({ where: { email: adminEmail } });
  if (admin) return;

  const hashedPassword = await bcrypt.hash("admin123", 10);

  await User.create({
    fullname: "Admin",
    username: "admin",
    email: adminEmail,
    password: hashedPassword,
    role: "admin",
  });

  console.log("✅ Admin created");
};
