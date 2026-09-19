import express from "express";
import jwt from "jsonwebtoken";
import { submitFeedback, getAllFeedback } from "../controllers/feedbackController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

const optionalVerifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    }
  } catch (error) {
    // Ignore invalid token for optional auth
  }
  next();
};

router.post("/", optionalVerifyToken, submitFeedback);
router.get("/", verifyToken, getAllFeedback);

export default router;
