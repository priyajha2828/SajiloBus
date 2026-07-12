<<<<<<< HEAD
const express = require("express");

const router = express.Router();

const {
  getPassengers,
  getPassengerById,
  createPassenger,
  updatePassenger,
  deletePassenger,
  getPassengerCount,
} = require("../controllers/passengerController");

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

module.exports = router;
=======
import express from "express";
import {registerPassenger,loginPassenger} from "../controllers/passengerController.js";

export const router = express.Router();

router.post("/register", registerPassenger);

 router.post("/login", loginPassenger);

// export default router;
>>>>>>> 20c3ca8643a1b4b50975f40c9f1c67be8a464915
