import express from "express";

import {
  getSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getScheduleCount,
} from "../controllers/scheduleController.js";

const router = express.Router();

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

export default router;