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

// Create
router.post("/", createDriver,isAdmin, verifyToken);

// Update
router.put("/:id", updateDriver,isAdmin, verifyToken);

// Delete
router.delete("/:id", deleteDriver);

// module.exports = router;