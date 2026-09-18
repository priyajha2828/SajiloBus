import express from "express";
import {
  getBuses,
  getBusById,
  getNearbyBuses,
  createBus,
  updateBus,
  deleteBus,
  getBusCount,
  getLiveBusLocations,
} from "../controllers/busController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Specific routes (MUST come before /:id)
router.get("/nearby", verifyToken, getNearbyBuses);
router.get("/count", verifyToken, isAdmin, getBusCount);
router.get("/live", verifyToken, getLiveBusLocations);

// General list & ID routes
router.get("/", verifyToken, getBuses);
router.get("/:id", verifyToken, getBusById);

// Admin CRUD routes
router.post("/", verifyToken, isAdmin, createBus);
router.put("/:id", verifyToken, isAdmin, updateBus);
router.patch("/:id", verifyToken, isAdmin, updateBus);
router.delete("/:id", verifyToken, isAdmin, deleteBus);

export default router;