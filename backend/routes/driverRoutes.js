import  express from "express";


<<<<<<< HEAD
const {
  getDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
  getDriverCount,
  getDriverStatus,
} = require("../controllers/driverController");

// Count
=======

import {getDrivers,getDriverById,createDriver,updateDriver,deleteDriver,getDriverCount,} from "../controllers/driverController.js";

export const router = express.Router();
// Count (MUST be before /:id)
>>>>>>> 20c3ca8643a1b4b50975f40c9f1c67be8a464915
router.get("/count", getDriverCount);

// Driver Status
router.get("/status", getDriverStatus);

// Get all drivers
router.get("/", getDrivers);

// Get one driver
router.get("/:id", getDriverById);

// Create
router.post("/", createDriver);

// Update
router.put("/:id", updateDriver);

// Delete
router.delete("/:id", deleteDriver);

// module.exports = router;