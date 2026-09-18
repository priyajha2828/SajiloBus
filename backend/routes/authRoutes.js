import express from "express";
import { commonLogin, commonSignup, getMe } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Common Login for Admin, Driver, and Passenger
router.post("/login", commonLogin);

// Passenger Signup
router.post("/signup", commonSignup);
router.post("/register", commonSignup);

// Profile for current logged in user
router.get("/me", verifyToken, getMe);

export default router;
