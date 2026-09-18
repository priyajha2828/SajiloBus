import express from "express";
import {
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
  getAdminDashboardStats,
} from "../controllers/adminController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginAdmin);

router.get("/me", verifyToken, isAdmin, getAdminProfile);
router.patch("/me", verifyToken, isAdmin, updateAdminProfile);
router.put("/me", verifyToken, isAdmin, updateAdminProfile);

router.get("/dashboard", verifyToken, isAdmin, getAdminDashboardStats);

export default router;