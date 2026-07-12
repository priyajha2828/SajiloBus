const express = require("express");

const router = express.Router();

const {
  getPassengers,
  getPassengerById,
  createPassenger,
  updatePassenger,
  deletePassenger,
  getPassengerCount,
} = require("../controllers/passengerController");

// Count
router.get("/count", getPassengerCount);

// Get All
router.get("/", getPassengers);

// Get By ID
router.get("/:id", getPassengerById);

// Create
router.post("/", createPassenger);

// Update
router.put("/:id", updatePassenger);

// Delete
router.delete("/:id", deletePassenger);

module.exports = router;