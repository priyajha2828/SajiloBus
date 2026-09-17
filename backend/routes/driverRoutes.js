import express from "express";
import {
  getDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
  getDriverCount,
  getDriverStatus,
} from "../controllers/driverController.js";

import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Count (must be before /:id)
router.get("/count", verifyToken, isAdmin, getDriverCount);

// Driver Status
router.get("/status", verifyToken, isAdmin, getDriverStatus);

// Get All Drivers
router.get("/", verifyToken, isAdmin, getDrivers);

// Get Driver By ID
router.get("/:id", verifyToken, isAdmin, getDriverById);

// Create Driver
router.post("/", verifyToken, isAdmin, createDriver);

// Update Driver
router.put("/:id", verifyToken, isAdmin, updateDriver);

// Delete Driver
router.delete("/:id", verifyToken, isAdmin, deleteDriver);

export default router;