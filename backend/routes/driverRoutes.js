<<<<<<< HEAD
import express from "express";

import {
  getDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
  getDriverCount,
  getDriverStatus,
} from "../controllers/driverController.js";

const router = express.Router();

// Count (must be before /:id)
router.get("/count", getDriverCount);

// Driver Status
router.get("/status", getDriverStatus);

// Get All
router.get("/", getDrivers);

// Get By ID
router.get("/:id", getDriverById);
=======
import  express from "express";
import {
    getDrivers,
    getDriverById,
    createDriver,
    updateDriver,
    deleteDriver,
    getDriverCount,
} from "../controllers/driverController.js";
import { isAdmin, verifyToken } from "../middleware/authMiddleware.js";

export const router = express.Router();
// Count (MUST be before /:id)
router.get("/count", getDriverCount,isAdmin, verifyToken);

// Get all drivers
router.get("/", getDrivers,isAdmin, verifyToken);

// Get one driver
router.get("/:id", getDriverById,isAdmin, verifyToken);
>>>>>>> 6b440c43b355ae0215ef1a8d276cfea7c92e0780

// Create
router.post("/", createDriver,isAdmin, verifyToken);

// Update
router.put("/:id", updateDriver,isAdmin, verifyToken);

// Delete
router.delete("/:id", deleteDriver);

export default router;