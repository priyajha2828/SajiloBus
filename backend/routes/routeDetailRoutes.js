import express from "express";
import {
  getRouteDetails,
  getRouteDetailById,
  createRouteDetail,
  updateRouteDetail,
  deleteRouteDetail,
  getRouteDetailCount,
} from "../controllers/routeDetailController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/count", verifyToken, isAdmin, getRouteDetailCount);
router.get("/", verifyToken, getRouteDetails);
router.get("/:id", verifyToken, getRouteDetailById);

router.post("/", verifyToken, isAdmin, createRouteDetail);
router.put("/:id", verifyToken, isAdmin, updateRouteDetail);
router.patch("/:id", verifyToken, isAdmin, updateRouteDetail);
router.delete("/:id", verifyToken, isAdmin, deleteRouteDetail);

export default router;