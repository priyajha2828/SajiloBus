import express from "express";

import {
  getTrips,
  getTripById,
  createTrip,
  updateTrip,
  endTrip,
  deleteTrip,
  getTripCount,
  getRecentTrips,
} from "../controllers/tripController.js";

const router = express.Router();

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

export default router;