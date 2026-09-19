import express from "express";
import {
  createSOSAlert,
  getSOSQueue,
  getSOSById,
  updateSOSStatus,
  getSOSContacts,
  createSOSContact,
  updateSOSContact,
  deleteSOSContact,
} from "../controllers/sosController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// SOS Trigger & Management
router.post("/", verifyToken, createSOSAlert);
router.get("/", verifyToken, getSOSQueue);
router.get("/:id", verifyToken, getSOSById);
router.patch("/:id/status", verifyToken, isAdmin, updateSOSStatus);

export default router;

// Dedicated router for /sos-contacts
export const sosContactRouter = express.Router();
sosContactRouter.get("/", verifyToken, getSOSContacts);
sosContactRouter.post("/", verifyToken, createSOSContact);
sosContactRouter.put("/:id", verifyToken, updateSOSContact);
sosContactRouter.patch("/:id", verifyToken, updateSOSContact);
sosContactRouter.delete("/:id", verifyToken, deleteSOSContact);
