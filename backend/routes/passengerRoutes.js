import express from "express";
import {
  getPassengers,
  getPassengerById,
  createPassenger,
  updatePassenger,
  deletePassenger,
  getPassengerCount,
  registerPassenger,
  loginPassenger,
} from "../controllers/passengerController.js";

import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Passenger Mobile App
router.post("/register", registerPassenger);
router.post("/login", loginPassenger);

// Admin Protected Routes
router.get("/count", verifyToken, isAdmin, getPassengerCount);
router.get("/", verifyToken, isAdmin, getPassengers);
router.get("/:id", verifyToken, isAdmin, getPassengerById);
router.post("/", verifyToken, isAdmin, createPassenger);
router.put("/:id", verifyToken, isAdmin, updatePassenger);
router.delete("/:id", verifyToken, isAdmin, deletePassenger);

export default router;