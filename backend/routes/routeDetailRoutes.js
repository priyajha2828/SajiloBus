import express from "express";
import {
  getRouteDetails,
  getRouteDetailById,
  createRouteDetail,
  updateRouteDetail,
  deleteRouteDetail,
  getRouteDetailCount,
} from "../controllers/routeDetailController.js";

import {
  verifyToken,
  isAdmin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Count (Keep before /:id)
router.get(
  "/count",
  verifyToken,
  isAdmin,
  getRouteDetailCount
);

// Get All
router.get(
  "/",
  verifyToken,
  isAdmin,
  getRouteDetails
);

// Get By ID
router.get(
  "/:id",
  verifyToken,
  isAdmin,
  getRouteDetailById
);

// Create
router.post(
  "/",
  verifyToken,
  isAdmin,
  createRouteDetail
);

// Update
router.put(
  "/:id",
  verifyToken,
  isAdmin,
  updateRouteDetail
);

// Delete
router.delete(
  "/:id",
  verifyToken,
  isAdmin,
  deleteRouteDetail
);

export default router;