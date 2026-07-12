const express = require("express");

const router = express.Router();

const {
  getTrips,
  getTripById,
  createTrip,
  updateTrip,
  endTrip,
  deleteTrip,
  getTripCount,
  getRecentTrips,
} = require("../controllers/tripController");

// Count
router.get("/count", getTripCount);

// Recent Trips
router.get("/recent", getRecentTrips);

// Get All Trips
router.get("/", getTrips);

// Get Trip By ID
router.get("/:id", getTripById);

// Start Trip
router.post("/", createTrip);

// Update Trip
router.put("/:id", updateTrip);

// End Trip
router.put("/end/:id", endTrip);

// Delete Trip
router.delete("/:id", deleteTrip);

module.exports = router;