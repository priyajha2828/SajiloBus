import express from "express";

import {
  getNotifications,
  getNotificationById,
  deleteNotification,
  getNotificationCount,
} from "../controllers/notificationController.js";

import {
  verifyToken,
  isAdmin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Count
router.get(
  "/count",
  verifyToken,
  isAdmin,
  getNotificationCount
);

// Get All
router.get(
  "/",
  verifyToken,
  isAdmin,
  getNotifications
);

// Get By ID
router.get(
  "/:id",
  verifyToken,
  isAdmin,
  getNotificationById
);

// Delete
router.delete(
  "/:id",
  verifyToken,
  isAdmin,
  deleteNotification
);

export default router;