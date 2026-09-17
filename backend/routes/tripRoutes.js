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

import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, isAdmin, getTrips);
router.get("/count", verifyToken, isAdmin, getTripCount);
router.get("/recent", verifyToken, isAdmin, getRecentTrips);
router.get("/:id", verifyToken, isAdmin, getTripById);

router.post("/", verifyToken, isAdmin, createTrip);

router.put("/:id", verifyToken, isAdmin, updateTrip);

router.put("/end/:id", verifyToken, isAdmin, endTrip);

router.delete("/:id", verifyToken, isAdmin, deleteTrip);

export default router;
