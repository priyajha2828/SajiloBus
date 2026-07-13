<<<<<<< HEAD
import express from "express";
=======
import  express from "express";
import  { getBuses, getBusById,createBus,updateBus,deleteBus,getBusCount,} from "../controllers/busController.js";
import { isAdmin, verifyToken } from "../middleware/authMiddleware.js";
>>>>>>> 6b440c43b355ae0215ef1a8d276cfea7c92e0780

import {
  getBuses,
  getBusById,
  createBus,
  updateBus,
  deleteBus,
  getBusCount,
  getLiveBusLocations,
} from "../controllers/busController.js";

const router = express.Router();

// Count
router.get("/count", getBusCount, isAdmin, verifyToken);

// Live Location
router.get("/live", getLiveBusLocations);

// Get All
router.get("/", getBuses, isAdmin, verifyToken);

<<<<<<< HEAD
// Get By ID
router.get("/:id", getBusById);
=======
// Get One
router.get("/:id", getBusById, isAdmin, verifyToken);
>>>>>>> 6b440c43b355ae0215ef1a8d276cfea7c92e0780

// Create
router.post("/", createBus, isAdmin, verifyToken);

// Update
router.put("/:id", updateBus, isAdmin, verifyToken);

// Delete
router.delete("/:id", deleteBus, isAdmin, verifyToken);

export default router;