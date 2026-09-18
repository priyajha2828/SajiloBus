import express from "express";
import {
  startTrip,
  endTrip,
  getTripById,
  getActiveTrips,
  recordTripLocation,
  getTripHistoryTrail,
  createTripStopEvent,
  getTripHistoryList,
  getTripManifest,
  exportTripManifest,
  getCurrentStopDetails,
  departStopAndConfirmBoarding,
  notifyWaitingPassengers,
  getTrips,
  createTrip,
  updateTrip,
  deleteTrip,
  getTripCount,
  getRecentTrips,
} from "../controllers/tripController.js";
import { verifyToken, isAdmin, isDriverOrAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Specific routes (MUST come before parametric /:id routes)
router.post("/start", verifyToken, isDriverOrAdmin, startTrip);
router.get("/active", verifyToken, getActiveTrips);
router.get("/history", verifyToken, getTripHistoryList);
router.get("/count", verifyToken, isAdmin, getTripCount);
router.get("/recent", verifyToken, isAdmin, getRecentTrips);

// Stop Management Screen routes
router.get("/:id/current-stop", verifyToken, getCurrentStopDetails);
router.post("/:id/depart-stop", verifyToken, isDriverOrAdmin, departStopAndConfirmBoarding);
router.post("/:id/notify-waiting-passengers", verifyToken, isDriverOrAdmin, notifyWaitingPassengers);

// Sub-resource / action routes on specific trip id
router.post("/:id/end", verifyToken, isDriverOrAdmin, endTrip);
router.post("/:id/location", verifyToken, isDriverOrAdmin, recordTripLocation);
router.get("/:id/history", verifyToken, getTripHistoryTrail);
router.post("/:id/stop-events", verifyToken, isDriverOrAdmin, createTripStopEvent);
router.get("/:id/manifest/export", verifyToken, exportTripManifest);
router.get("/:id/manifest", verifyToken, getTripManifest);

// Standard CRUD / Detail routes
router.get("/", verifyToken, getTrips);
router.get("/:id", verifyToken, getTripById);
router.post("/", verifyToken, isDriverOrAdmin, createTrip);
router.put("/:id", verifyToken, isAdmin, updateTrip);
router.patch("/:id", verifyToken, isAdmin, updateTrip);
router.delete("/:id", verifyToken, isAdmin, deleteTrip);

export default router;
