const prisma = require("../config/prisma");

// =============================
// Get All Notifications
// =============================

const getNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      include: {
        passenger: true,
        admin: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Create Notification
// =============================

const createNotification = async (req, res) => {
  try {
    const {
      passengerId,
      adminId,
      title,
      message,
    } = req.body;

    const notification = await prisma.notification.create({
      data: {
        passengerId: Number(passengerId),
        adminId: Number(adminId),
        title,
        message,
      },
    });

    res.status(201).json({
      success: true,
      message: "Notification Created Successfully",
      notification,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Mark All Notifications As Read
// =============================

const markAllAsRead = async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: {
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Delete Notification
// =============================

const deleteNotification = async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.notification.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Notification Deleted Successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getNotifications,
  createNotification,
  deleteNotification,
  markAllAsRead,
};