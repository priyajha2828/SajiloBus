import { prisma } from "../config/prisma.js";
import { getAuth } from "../config/firebase.js";
import jwt from "jsonwebtoken";

const getCurrentAdmin = async (req) => {
  if (req.user?.id) {
    return prisma.admin.findUnique({ where: { id: Number(req.user.id) } });
  }
  if (req.user?.firebaseUid) {
    return prisma.admin.findUnique({ where: { firebaseUid: req.user.firebaseUid } });
  }
  return null;
};

// ===========================
// Login Admin
// ===========================
export const loginAdmin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: "Firebase ID Token is required",
      });
    }

    const decodedToken = await getAuth().verifyIdToken(idToken);
    const firebaseUid = decodedToken.uid;

    const existingAdmin = await prisma.admin.findUnique({
      where: { firebaseUid },
    });

    if (!existingAdmin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const token = jwt.sign(
      {
        id: existingAdmin.id,
        role: "ADMIN",
        firebaseUid: existingAdmin.firebaseUid,
        email: existingAdmin.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      admin: existingAdmin,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===========================
// GET /admin/me — Current Admin Profile
// ===========================
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await getCurrentAdmin(req);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin profile not found",
      });
    }

    res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===========================
// PATCH /admin/me — Update Admin Profile
// ===========================
export const updateAdminProfile = async (req, res) => {
  try {
    const admin = await getCurrentAdmin(req);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin profile not found",
      });
    }

    const { name, email, phone } = req.body;

    const data = {};
    if (name !== undefined) data.name = name;
    if (email !== undefined) data.email = email;
    if (phone !== undefined) data.phone = phone;

    const updatedAdmin = await prisma.admin.update({
      where: { id: admin.id },
      data,
    });

    res.status(200).json({
      success: true,
      message: "Admin Profile Updated Successfully",
      admin: updatedAdmin,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===========================
// GET /admin/dashboard — Aggregate Statistics
// ===========================
export const getAdminDashboardStats = async (req, res) => {
  try {
    const [
      totalDrivers,
      onlineDrivers,
      totalBuses,
      activeBuses,
      totalRoutes,
      totalTrips,
      activeTrips,
      pendingSOS,
      totalPassengers,
    ] = await Promise.all([
      prisma.driver.count(),
      prisma.driver.count({ where: { isAvailable: true } }),
      prisma.bus.count(),
      prisma.bus.count({ where: { status: "ACTIVE" } }),
      prisma.route.count(),
      prisma.trip.count(),
      prisma.trip.count({ where: { endedAt: null } }),
      prisma.sOS.count({ where: { status: "PENDING" } }),
      prisma.passenger.count(),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalDrivers,
        onlineDrivers,
        totalBuses,
        activeBuses,
        totalRoutes,
        totalTrips,
        activeTrips,
        pendingSOS,
        totalPassengers,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};