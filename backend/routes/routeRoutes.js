import express from "express";
import {
  getRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
} from "../controllers/routeController.js";

import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, isAdmin, getRoutes);
router.get("/:id", verifyToken, isAdmin, getRouteById);
router.post("/", verifyToken, isAdmin, createRoute);
router.put("/:id", verifyToken, isAdmin, updateRoute);
router.delete("/:id", verifyToken, isAdmin, deleteRoute);

export default router;