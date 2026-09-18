import { prisma } from "../config/prisma.js";
import { getAuth } from "../config/firebase.js";
import jwt from "jsonwebtoken";

const getCurrentDriver = async (req) => {
  if (req.user?.id) {
    return prisma.driver.findUnique({
      where: { id: Number(req.user.id) },
    });
  }

  if (req.user?.firebaseUid) {
    return prisma.driver.findUnique({
      where: { firebaseUid: req.user.firebaseUid },
    });
  }

  return null;
};

// ===========================
// Driver Login
// ===========================
export const loginDriver = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: "ID Token is required",
      });
    }

    const decodedToken = await getAuth().verifyIdToken(idToken);

    const driver = await prisma.driver.findUnique({
      where: {
        firebaseUid: decodedToken.uid,
      },
    });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    const token = jwt.sign(
      {
        id: driver.id,
        role: "DRIVER",
        firebaseUid: driver.firebaseUid,
        email: driver.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    try {
      await prisma.driverLoginLog.create({
        data: {
          driverId: driver.id,
          loginTime: new Date(),
          status: "SUCCESS",
        },
      });
    } catch (err) {
      console.log("Login Log Error:", err.message);
    }

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      driver,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===========================
// Get My Profile
// ===========================
export const getMyProfile = async (req, res) => {
  try {
    const driver = await getCurrentDriver(req);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    const [totalTrips, completedTrips, activeTrip, currentAssignment] =
      await Promise.all([
        prisma.trip.count({
          where: { driverId: driver.id },
        }),
        prisma.trip.count({
          where: { driverId: driver.id, endedAt: { not: null } },
        }),
        prisma.trip.findFirst({
          where: { driverId: driver.id, endedAt: null },
          include: { route: true, bus: true },
          orderBy: { startedAt: "desc" },
        }),
        prisma.busAssignment.findFirst({
          where: {
            driverId: driver.id,
            assignedTo: null,
          },
          include: { bus: true },
          orderBy: { assignedFrom: "desc" },
        }),
      ]);

    res.status(200).json({
      success: true,
      driver: {
        ...driver,
        stats: {
          totalTrips,
          completedTrips,
          inProgress: activeTrip ? 1 : 0,
        },
        activeTrip,
        assignment: currentAssignment,
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
// Update My Profile
// ===========================
export const updateMyProfile = async (req, res) => {
  try {
    const driver = await getCurrentDriver(req);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    const { name, email, phone, licenseNo } = req.body;

    const data = {};

    if (name !== undefined) data.name = name;
    if (email !== undefined) data.email = email;
    if (phone !== undefined) data.phone = phone;
    if (licenseNo !== undefined) data.licenseNo = licenseNo;

    const updatedDriver = await prisma.driver.update({
      where: { id: driver.id },
      data,
    });

    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      driver: updatedDriver,
    });
  } catch (error) {
    console.error(error);

    if (error.code === "P2002") {
      return res.status(400).json({
        success: false,
        message: "Email or license number already in use",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===========================
// Toggle Availability
// ===========================
export const toggleAvailability = async (req, res) => {
  try {
    const driver = await getCurrentDriver(req);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    const { isAvailable } = req.body;

    const toggled = isAvailable !== undefined ? Boolean(isAvailable) : !driver.isAvailable;

    await prisma.driver.update({
      where: { id: driver.id },
      data: { isAvailable: toggled },
    });

    res.status(200).json({
      success: true,
      message: toggled ? "Driver is now ONLINE" : "Driver is now OFFLINE",
      isAvailable: toggled,
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
// Get My Bus Assignment
// ===========================
export const getMyAssignment = async (req, res) => {
  try {
    const driver = await getCurrentDriver(req);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    const assignment = await prisma.busAssignment.findFirst({
      where: {
        driverId: driver.id,
        OR: [
          { assignedTo: null },
          { assignedTo: { gte: new Date() } },
        ],
      },
      include: {
        bus: true,
      },
      orderBy: {
        assignedFrom: "desc",
      },
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "No active assignment found",
      });
    }

    res.status(200).json({
      success: true,
      assignment,
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
// Get My Login Logs
// ===========================
export const getMyLoginLogs = async (req, res) => {
  try {
    const driver = await getCurrentDriver(req);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const skip = (page - 1) * limit;

    const [total, loginLogs] = await Promise.all([
      prisma.driverLoginLog.count({
        where: { driverId: driver.id },
      }),
      prisma.driverLoginLog.findMany({
        where: { driverId: driver.id },
        orderBy: { loginTime: "desc" },
        skip,
        take: limit,
      }),
    ]);

    res.status(200).json({
      success: true,
      loginLogs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
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