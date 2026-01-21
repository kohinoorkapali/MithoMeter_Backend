import { Notification } from "../Model/notificationModel.js";
import { User } from "../Model/userModel.js";

export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const notifications = await Notification.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]], 
    });

    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load notifications" });
  }
};

  export const markNotificationsAsRead = async (req, res) => {
    const userId = req.user.id;
  
    await Notification.update(
      { isRead: true },
      { where: { userId, isRead: false } }
    );
  
    res.json({ message: "Notifications marked as read" });
  };
  