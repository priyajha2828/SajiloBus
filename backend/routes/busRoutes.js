import  express from "express";
import  { getBuses, getBusById,createBus,updateBus,deleteBus,getBusCount,} from "../controllers/busController.js";

export const router = express.Router();

// Count
router.get("/count", getBusCount);

// Get All
router.get("/", getBuses);

// Get One
router.get("/:id", getBusById);

// Create
router.post("/", createBus);

// Update
router.put("/:id", updateBus);

// Delete
router.delete("/:id", deleteBus);

// export default router;