import express from "express";
import {
  getNotifications,
  getNotificationById,
  createNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getNotificationCount,
} from "../controllers/notificationController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/count", verifyToken, getNotificationCount);
router.patch("/read-all", verifyToken, markAllNotificationsAsRead);

router.get("/", verifyToken, getNotifications);
router.get("/:id", verifyToken, getNotificationById);

router.post("/", verifyToken, isAdmin, createNotification);
router.patch("/:id/read", verifyToken, markNotificationAsRead);
router.delete("/:id", verifyToken, isAdmin, deleteNotification);

export default router;