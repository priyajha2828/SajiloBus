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

import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Count
router.get("/count", verifyToken, isAdmin, getBusCount);

// Live Bus Locations
router.get("/live", verifyToken, isAdmin, getLiveBusLocations);

// Get All Buses
router.get("/", verifyToken, isAdmin, getBuses);

// Get Bus By ID
router.get("/:id", verifyToken, isAdmin, getBusById);

// Create Bus
router.post("/", verifyToken, isAdmin, createBus);

// Update Bus
router.put("/:id", verifyToken, isAdmin, updateBus);

// Delete Bus
router.delete("/:id", verifyToken, isAdmin, deleteBus);

export default router;