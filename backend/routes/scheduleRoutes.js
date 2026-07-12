const express = require("express");

const router = express.Router();

const {
  getSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getScheduleCount,
} = require("../controllers/scheduleController");

// Count
router.get("/count", getScheduleCount);

// Get All
router.get("/", getSchedules);

// Get By ID
router.get("/:id", getScheduleById);

// Create
router.post("/", createSchedule);

// Update
router.put("/:id", updateSchedule);

// Delete
router.delete("/:id", deleteSchedule);

module.exports = router;