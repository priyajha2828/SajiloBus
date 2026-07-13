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

const router = express.Router();

// Authentication
router.post("/register", registerPassenger);
router.post("/login", loginPassenger);

// Count
router.get("/count", getPassengerCount);

// Get All
router.get("/", getPassengers);

// Get By ID
router.get("/:id", getPassengerById);

// Create
router.post("/", createPassenger);

// Update
router.put("/:id", updatePassenger);

// Delete
router.delete("/:id", deletePassenger);

export default router;