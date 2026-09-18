import express from "express";
import {
  getAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getAssignmentCount,
} from "../controllers/busAssignmentController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/count", verifyToken, isAdmin, getAssignmentCount);

router.get("/", verifyToken, getAssignments);
router.get("/:id", verifyToken, getAssignmentById);

router.post("/", verifyToken, isAdmin, createAssignment);
router.put("/:id", verifyToken, isAdmin, updateAssignment);
router.patch("/:id", verifyToken, isAdmin, updateAssignment);
router.delete("/:id", verifyToken, isAdmin, deleteAssignment);

export default router;