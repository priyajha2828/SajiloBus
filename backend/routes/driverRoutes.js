const express = require("express");

const router = express.Router();

const {
  getDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
  getDriverCount,
  getDriverStatus,
} = require("../controllers/driverController");

// Count
router.get("/count", getDriverCount);

// Driver Status
router.get("/status", getDriverStatus);

// Get all drivers
router.get("/", getDrivers);

// Get one driver
router.get("/:id", getDriverById);

// Create
router.post("/", createDriver);

// Update
router.put("/:id", updateDriver);

// Delete
router.delete("/:id", deleteDriver);

module.exports = router;