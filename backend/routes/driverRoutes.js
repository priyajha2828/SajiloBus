const express = require("express");

const router = express.Router();

const {
  getDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
  getDriverCount,
} = require("../controllers/driverController");

// Count (MUST be before /:id)
router.get("/count", getDriverCount);

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