const express = require("express");

const router = express.Router();

const {
  getBuses,
  getBusById,
  createBus,
  updateBus,
  deleteBus,
  getBusCount,
} = require("../controllers/busController");

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

module.exports = router;