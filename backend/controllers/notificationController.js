import { prisma } from "../config/prisma.js";

// =============================
// Get All Notifications
// =============================

export const getNotifications = async (req, res) => {
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
// Get Notification By ID
// =============================

export const getNotificationById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const notification = await prisma.notification.findUnique({
      where: {
        id,
      },
      include: {
        passenger: true,
        admin: true,
      },
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
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
// Delete Notification
// =============================

export const deleteNotification = async (req, res) => {
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

// =============================
// Notification Count
// =============================

export const getNotificationCount = async (req, res) => {
  try {
    const count = await prisma.notification.count();

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

