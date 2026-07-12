import  express from "express";



import {getDrivers,getDriverById,createDriver,updateDriver,deleteDriver,getDriverCount,} from "../controllers/driverController.js";

export const router = express.Router();
// Count (MUST be before /:id)
router.get("/count", getDriverCount);

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