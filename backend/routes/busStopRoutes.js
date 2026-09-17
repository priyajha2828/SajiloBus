import express from "express";

import {
  getBusStops,
  getBusStopById,
  createBusStop,
  updateBusStop,
  deleteBusStop,
  getBusStopCount,
} from "../controllers/busStopController.js";

const router = express.Router();

// Count (keep before /:id)
router.get("/count", getBusStopCount);

// Get All Bus Stops
router.get("/", getBusStops);

// Get Bus Stop By ID
router.get("/:id", getBusStopById);

// Create Bus Stop
router.post("/", createBusStop);

// Update Bus Stop
router.put("/:id", updateBusStop);

// Delete Bus Stop
router.delete("/:id", deleteBusStop);

export default router;