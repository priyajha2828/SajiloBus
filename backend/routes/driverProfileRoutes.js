import express from "express";

import {
  loginDriver,
  getMyProfile,
  updateMyProfile,
  toggleAvailability,
  getMyAssignment,
  getMyLoginLogs,
  getDriverDashboard,
} from "../controllers/driverProfileController.js";

import { verifyToken, isDriver } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginDriver);

router.get("/dashboard", getDriverDashboard);
router.get("/me/dashboard", getDriverDashboard);
router.get("/me", verifyToken, isDriver, getMyProfile);
router.get("/me/assignment", verifyToken, isDriver, getMyAssignment);
router.get("/me/login-logs", verifyToken, isDriver, getMyLoginLogs);

router.patch("/me", verifyToken, isDriver, updateMyProfile);
router.patch("/me/availability", verifyToken, isDriver, toggleAvailability);

export default router;