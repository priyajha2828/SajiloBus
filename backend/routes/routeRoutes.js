import express from "express";

import {
  getRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
} from "../controllers/routeController.js";

const router = express.Router();

// Get All Routes
router.get("/", getRoutes);

// Get Route By ID
router.get("/:id", getRouteById);

// Create Route
router.post("/", createRoute);

// Update Route
router.put("/:id", updateRoute);

// Delete Route
router.delete("/:id", deleteRoute);

export default router;