const express = require("express");

const router = express.Router();

const {
  getNotifications,
  createNotification,
  deleteNotification,
  markAllAsRead,
} = require("../controllers/notificationController");

router.get("/", getNotifications);

router.post("/", createNotification);

router.put("/read-all", markAllAsRead);

router.delete("/:id", deleteNotification);

module.exports = router;