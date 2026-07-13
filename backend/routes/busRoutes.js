import express from "express";

import {
  getBuses,
  getBusById,
  createBus,
  updateBus,
  deleteBus,
  getBusCount,
  getLiveBusLocations,
} from "../controllers/busController.js";

const router = express.Router();

// Count
router.get("/count", getBusCount);

// Live Location
router.get("/live", getLiveBusLocations);

// Get All
router.get("/", getBuses);

// Get By ID
router.get("/:id", getBusById);

// Create
router.post("/", createBus);

// Update
router.put("/:id", updateBus);

// Delete
router.delete("/:id", deleteBus);

export default router;