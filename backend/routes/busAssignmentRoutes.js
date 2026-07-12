const express = require("express");

const router = express.Router();

const {
  getAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getAssignmentCount,
} = require("../controllers/busAssignmentController");

// Count
router.get("/count", getAssignmentCount);

// Get All Assignments
router.get("/", getAssignments);

// Get Assignment By ID
router.get("/:id", getAssignmentById);

// Create Assignment
router.post("/", createAssignment);

// Update Assignment
router.put("/:id", updateAssignment);

// Delete Assignment
router.delete("/:id", deleteAssignment);

module.exports = router;