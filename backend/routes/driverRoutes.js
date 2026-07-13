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

const router = express.Router();

// Count (must be before /:id)
router.get("/count", getDriverCount);

// Driver Status
router.get("/status", getDriverStatus);

// Get All
router.get("/", getDrivers);

// Get By ID
router.get("/:id", getDriverById);

// Create
router.post("/", createDriver);

// Update
router.put("/:id", updateDriver);

// Delete
router.delete("/:id", deleteDriver);

export default router;