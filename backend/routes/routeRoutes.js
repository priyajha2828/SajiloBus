import express from "express";
import {
  getRoutes,
  searchRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
  addStopToRoute,
} from "../controllers/routeController.js";

import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public / Passenger route search (journey planner)
router.get("/search", verifyToken, searchRoutes);

// General route list
router.get("/", verifyToken, getRoutes);

// Detail route by ID
router.get("/:id", verifyToken, getRouteById);

// Admin routes
router.post("/", verifyToken, isAdmin, createRoute);
router.put("/:id", verifyToken, isAdmin, updateRoute);
router.patch("/:id", verifyToken, isAdmin, updateRoute);
router.delete("/:id", verifyToken, isAdmin, deleteRoute);

// Route stop ordering sub-resource
router.post("/:id/stops", verifyToken, isAdmin, addStopToRoute);

export default router;