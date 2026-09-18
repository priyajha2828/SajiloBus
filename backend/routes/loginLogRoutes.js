import express from "express";
import {
  getPassengerLoginLogs,
  getDriverLoginLogs,
  createLoginLog,
} from "../controllers/loginLogController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/passengers", verifyToken, isAdmin, getPassengerLoginLogs);
router.get("/drivers", verifyToken, isAdmin, getDriverLoginLogs);
router.post("/", createLoginLog);

export default router;
