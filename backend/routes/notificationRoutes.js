import express from "express";

import {
  getNotifications,
  createNotification,
  deleteNotification,
  markAllAsRead,
} from "../controllers/notificationController.js";

const router = express.Router();

// Get All Notifications
router.get("/", getNotifications);

// Create Notification
router.post("/", createNotification);

// Mark All as Read
router.put("/read-all", markAllAsRead);

// Delete Notification
router.delete("/:id", deleteNotification);

export default router;