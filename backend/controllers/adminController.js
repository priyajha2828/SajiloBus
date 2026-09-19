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

// ===========================
// GET /admin/reports — Comprehensive Operational & Safety Analytics Reports
// ===========================
export const getAdminReports = async (req, res) => {
  try {
    const [
      trips,
      sosAlerts,
      feedbacks,
      driverLogins,
      buses,
      routes,
    ] = await Promise.all([
      prisma.trip.findMany({
        include: {
          bus: true,
          driver: true,
          route: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.sOS.findMany({
        include: {
          passenger: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      (prisma.feedback || prisma.Feedback)
        ? (prisma.feedback || prisma.Feedback).findMany({
            include: { passenger: true },
            orderBy: { createdAt: "desc" },
          })
        : Promise.resolve([]),
      prisma.driverLoginLog.findMany({
        include: { driver: true },
        orderBy: { loginTime: "desc" },
        take: 50,
      }),
      prisma.bus.findMany(),
      prisma.route.findMany(),
    ]);

    // 1. Trip Summary Statistics
    const totalTrips = trips.length;
    const completedTrips = trips.filter((t) => t.endedAt !== null).length;
    const activeTrips = totalTrips - completedTrips;
    const completionRate = totalTrips > 0 ? ((completedTrips / totalTrips) * 100).toFixed(1) : 0;

    // 2. SOS Emergency Alerts Analysis
    const totalSOS = sosAlerts.length;
    const pendingSOS = sosAlerts.filter((s) => s.status === "PENDING").length;
    const resolvedSOS = sosAlerts.filter((s) => s.status === "RESOLVED").length;
    const inProgressSOS = sosAlerts.filter((s) => s.status === "IN_PROGRESS").length;

    // 3. Feedback Analytics
    const totalFeedbacks = feedbacks.length;
    const avgRating =
      totalFeedbacks > 0
        ? (
            feedbacks.reduce((acc, f) => acc + (f.rating || 5), 0) / totalFeedbacks
          ).toFixed(1)
        : 5.0;

    // Feedback by category
    const feedbackCategories = {};
    feedbacks.forEach((f) => {
      const cat = f.category || "General";
      feedbackCategories[cat] = (feedbackCategories[cat] || 0) + 1;
    });

    // 4. Driver Performance & Fleet Utilization
    const driverTripCounts = {};
    trips.forEach((t) => {
      if (t.driver?.name) {
        driverTripCounts[t.driver.name] = (driverTripCounts[t.driver.name] || 0) + 1;
      }
    });

    const routeTripCounts = {};
    trips.forEach((t) => {
      if (t.route?.routeName) {
        routeTripCounts[t.route.routeName] = (routeTripCounts[t.route.routeName] || 0) + 1;
      }
    });

    res.status(200).json({
      success: true,
      reports: {
        summary: {
          totalTrips,
          completedTrips,
          activeTrips,
          completionRate: `${completionRate}%`,
          totalSOS,
          pendingSOS,
          resolvedSOS,
          avgRating,
          totalFeedbacks,
        },
        trips,
        sosAlerts,
        feedbacks,
        driverLogins,
        analytics: {
          driverTripCounts,
          routeTripCounts,
          feedbackCategories,
          sosBreakdown: {
            PENDING: pendingSOS,
            IN_PROGRESS: inProgressSOS,
            RESOLVED: resolvedSOS,
          },
        },
      },
    });
  } catch (error) {
    console.error("Get Reports Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};