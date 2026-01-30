import crypto from "crypto";
import bcrypt from "bcrypt";
import { User } from "../Model/associations.js";
import { PasswordResetToken } from "../Model/passwordResetTokenModel.js";

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate token and expiry
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await PasswordResetToken.create({ userId: user.id, token, expiresAt });

    // Demo: send token as a link for frontend
    const resetLink = `http://localhost:5173/reset-password?token=${token}`;

    res.status(200).json({
      message: "Password reset link generated",
      resetLink,
    });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword)
    return res.status(400).json({ message: "Token and new password required" });

  try {
    const tokenData = await PasswordResetToken.findOne({ where: { token, used: false } });
    if (!tokenData) return res.status(400).json({ message: "Invalid or expired token" });

    if (new Date(tokenData.expiresAt) < new Date())
      return res.status(400).json({ message: "Token expired" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.update({ password: hashedPassword }, { where: { id: tokenData.userId } });

    await tokenData.update({ used: true });

    res.status(200).json({ message: "Password successfully reset" });
  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
