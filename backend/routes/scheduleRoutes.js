import express from "express";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";
import {
  getSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getScheduleCount,
} from "../controllers/scheduleController.js";

const router = express.Router();

router.get("/count", verifyToken, isAdmin, getScheduleCount);
router.get("/", verifyToken, getSchedules);
router.get("/:id", verifyToken, getScheduleById);

router.post("/", verifyToken, isAdmin, createSchedule);
router.put("/:id", verifyToken, isAdmin, updateSchedule);
router.patch("/:id", verifyToken, isAdmin, updateSchedule);
router.delete("/:id", verifyToken, isAdmin, deleteSchedule);

export default router;