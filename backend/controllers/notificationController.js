import { prisma } from "../config/prisma.js";

// Helper to determine user entity based on role
const getUserEntity = async (req) => {
  if (!req.user) return null;
  const { role, id, firebaseUid } = req.user;

  if (role === "PASSENGER") {
    if (id) return { passengerId: id };
    if (firebaseUid) {
      const p = await prisma.passenger.findUnique({ where: { firebaseUid } });
      return p ? { passengerId: p.id } : null;
    }
  }

  if (role === "ADMIN") {
    if (id) return { adminId: id };
    if (firebaseUid) {
      const a = await prisma.admin.findUnique({ where: { firebaseUid } });
      return a ? { adminId: a.id } : null;
    }
  }

  return null;
};

// =============================
// GET /notifications (per role, with unread count & category filter)
// =============================
export const getNotifications = async (req, res) => {
  try {
    const { category, isRead } = req.query;
    const userEntity = await getUserEntity(req);

    const where = {};
    if (userEntity?.passengerId) where.passengerId = userEntity.passengerId;
    if (userEntity?.adminId) where.adminId = userEntity.adminId;

    if (isRead !== undefined) {
      where.isRead = isRead === "true";
    }

    if (category) {
      where.OR = [
        { title: { contains: category, mode: "insensitive" } },
        { message: { contains: category, mode: "insensitive" } },
      ];
    }

    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        include: {
          passenger: true,
          admin: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.notification.count({
        where: {
          ...where,
          isRead: false,
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      unreadCount,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// GET /notifications/:id
// =============================
export const getNotificationById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid Notification ID" });
    }

    const notification = await prisma.notification.findUnique({
      where: { id },
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
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// POST /notifications — Admin / System creates notification
// =============================
export const createNotification = async (req, res) => {
  try {
    const { title, message, passengerId, adminId } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: "title and message are required",
      });
    }

    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        passengerId: passengerId ? Number(passengerId) : null,
        adminId: adminId ? Number(adminId) : null,
        isRead: false,
      },
    });

    res.status(201).json({
      success: true,
      message: "Notification created successfully",
      notification,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// PATCH /notifications/:id/read — Mark one read
// =============================
export const markNotificationAsRead = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid Notification ID" });
    }

    const notification = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// PATCH /notifications/read-all — Mark all read
// =============================
export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userEntity = await getUserEntity(req);
    const where = {};
    if (userEntity?.passengerId) where.passengerId = userEntity.passengerId;
    if (userEntity?.adminId) where.adminId = userEntity.adminId;

    await prisma.notification.updateMany({
      where: {
        ...where,
        isRead: false,
      },
      data: { isRead: true },
    });

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// DELETE /notifications/:id
// =============================
export const deleteNotification = async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.notification.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Notification Deleted Successfully",
    });
  } catch (error) {
    console.error(error);
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
    res.status(200).json({ success: true, count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
