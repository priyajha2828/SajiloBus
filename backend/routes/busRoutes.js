import  express from "express";
import  { getBuses, getBusById,createBus,updateBus,deleteBus,getBusCount,} from "../controllers/busController.js";
import { isAdmin, verifyToken } from "../middleware/authMiddleware.js";

export const router = express.Router();

// Count
router.get("/count", getBusCount, isAdmin, verifyToken);

// Get All
router.get("/", getBuses, isAdmin, verifyToken);

// Get One
router.get("/:id", getBusById, isAdmin, verifyToken);

// Create
router.post("/", createBus, isAdmin, verifyToken);

// Update
router.put("/:id", updateBus, isAdmin, verifyToken);

// Delete
router.delete("/:id", deleteBus, isAdmin, verifyToken);

// export default router;