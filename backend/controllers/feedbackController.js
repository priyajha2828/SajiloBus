import { prisma } from "../config/prisma.js";

// Helper to resolve passenger ID from request token or fallback
const getPassengerIdFromReq = async (req) => {
  try {
    if (req.user?.id) {
      const id = Number(req.user.id);
      if (!isNaN(id)) {
        const p = await prisma.passenger.findUnique({ where: { id } });
        if (p) return p.id;
      }
    }
    if (req.user?.firebaseUid) {
      const p = await prisma.passenger.findUnique({
        where: { firebaseUid: req.user.firebaseUid },
      });
      if (p) return p.id;
    }
    const firstPassenger = await prisma.passenger.findFirst();
    return firstPassenger ? firstPassenger.id : null;
  } catch (err) {
    console.error("Passenger lookup fallback error:", err);
    return null;
  }
};

// POST /feedback — Submit feedback
export const submitFeedback = async (req, res) => {
  try {
    const { rating, category, comment } = req.body;
    const passengerId = await getPassengerIdFromReq(req);

    if (!comment || !comment.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment text is required",
      });
    }

    const data = {
      rating: Number(rating) || 5,
      category: category || "General",
      comment: comment.trim(),
    };
    if (passengerId) {
      data.passengerId = passengerId;
    }

    const feedbackModel = prisma.feedback || prisma.Feedback;
    if (!feedbackModel) {
      throw new Error("Feedback model is not initialized on Prisma client. Please restart backend server.");
    }

    const feedback = await feedbackModel.create({
      data,
      include: {
        passenger: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Thank you for your feedback!",
      feedback,
    });
  } catch (error) {
    console.error("Submit Feedback Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /feedback — Retrieve feedback list
export const getAllFeedback = async (req, res) => {
  try {
    const feedbackModel = prisma.feedback || prisma.Feedback;
    if (!feedbackModel) {
      return res.status(200).json({
        success: true,
        count: 0,
        feedbacks: [],
      });
    }

    const feedbacks = await feedbackModel.findMany({
      include: {
        passenger: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      feedbacks,
    });
  } catch (error) {
    console.error("Get Feedback Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
