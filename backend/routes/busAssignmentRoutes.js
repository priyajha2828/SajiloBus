import express from "express";

import {
  getAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getAssignmentCount,
} from "../controllers/busAssignmentController.js";

const router = express.Router();

router.get("/count", getAssignmentCount);

router.get("/", getAssignments);

router.get("/:id", getAssignmentById);

router.post("/", createAssignment);

router.put("/:id", updateAssignment);

router.delete("/:id", deleteAssignment);

export default router;