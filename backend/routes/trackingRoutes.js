import express from "express";

import {
  updateLocation,
  getLatestLocation,
  getTripHistory,
} from "../controllers/trackingController.js";

const router = express.Router();

router.post("/update", updateLocation);

router.get("/latest/:tripId", getLatestLocation);

router.get("/history/:tripId", getTripHistory);

export default router;
