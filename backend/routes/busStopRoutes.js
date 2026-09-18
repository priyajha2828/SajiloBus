import express from "express";
import {
  getBusStops,
  getNearbyBusStops,
  getBusStopById,
  createBusStop,
  updateBusStop,
  deleteBusStop,
  getBusStopCount,
} from "../controllers/busStopController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Specific routes before /:id
router.get("/nearby", verifyToken, getNearbyBusStops);
router.get("/count", verifyToken, isAdmin, getBusStopCount);

// General list & detail
router.get("/", verifyToken, getBusStops);
router.get("/:id", verifyToken, getBusStopById);

// Admin CRUD
router.post("/", verifyToken, isAdmin, createBusStop);
router.put("/:id", verifyToken, isAdmin, updateBusStop);
router.patch("/:id", verifyToken, isAdmin, updateBusStop);
router.delete("/:id", verifyToken, isAdmin, deleteBusStop);

export default router;