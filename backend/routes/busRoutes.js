const express = require("express");

const router = express.Router();

const {
  getBuses,
  getBusById,
  createBus,
  updateBus,
  deleteBus,
  getBusCount,
   getLiveBusLocations,
} = require("../controllers/busController");

// Count
router.get("/count", getBusCount);

// Get All
router.get("/", getBuses);



// Create
router.post("/", createBus);

// Update
router.put("/:id", updateBus);

// Delete
router.delete("/:id", deleteBus);

router.get("/:id", getBusById);

module.exports = router;