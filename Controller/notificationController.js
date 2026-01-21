export const getUserNotifications = async (req, res) => {
    const userId = req.user.id; // from auth middleware
  
    const notifications = await Notification.findAll({
      where: { userId },
      order: [["created_at", "DESC"]],
    });
  
    res.json(notifications);
  };