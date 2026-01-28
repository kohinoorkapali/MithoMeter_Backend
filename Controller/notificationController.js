import { Notification } from "../Model/associations.js";

export const getUserNotifications = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;

    const notifications = await Notification.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    res.json(notifications);
  } catch (error) {
    console.error("NOTIFICATION ERROR:", error);
    res.status(500).json({ message: "Failed to load notifications" });
  }
};

export const markNotificationsAsRead = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;

    await Notification.update(
      { isRead: true },
      { where: { userId, isRead: false } }
    );

    res.json({ message: "Notifications marked as read" });
  } catch (error) {
    console.error("MARK READ ERROR:", error);
    res.status(500).json({ message: "Failed to mark as read" });
  }
};
