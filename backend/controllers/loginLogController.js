import { prisma } from "../config/prisma.js";

// Service function for recording Passenger login/logout
export const recordPassengerLoginLog = async ({ passengerId, status, logoutTime }) => {
  try {
    return await prisma.passengerLoginLog.create({
      data: {
        passengerId: Number(passengerId),
        loginTime: new Date(),
        logoutTime: logoutTime ? new Date(logoutTime) : null,
        status: status || "SUCCESS",
      },
    });
  } catch (error) {
    console.error("Passenger Login Log Error:", error.message);
    return null;
  }
};

// Service function for recording Driver login/logout
export const recordDriverLoginLog = async ({ driverId, status, logoutTime }) => {
  try {
    return await prisma.driverLoginLog.create({
      data: {
        driverId: Number(driverId),
        loginTime: new Date(),
        logoutTime: logoutTime ? new Date(logoutTime) : null,
        status: status || "SUCCESS",
      },
    });
  } catch (error) {
    console.error("Driver Login Log Error:", error.message);
    return null;
  }
};

// ===========================
// GET /login-logs/passengers - Audit endpoint for passenger login logs
// ===========================
export const getPassengerLoginLogs = async (req, res) => {
  try {
    const { passengerId, status, page, limit } = req.query;

    const where = {};
    if (passengerId) where.passengerId = Number(passengerId);
    if (status) where.status = status;

    const pageNum = Math.max(Number(page) || 1, 1);
    const limitNum = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const skip = (pageNum - 1) * limitNum;

    const [total, logs] = await Promise.all([
      prisma.passengerLoginLog.count({ where }),
      prisma.passengerLoginLog.findMany({
        where,
        include: { passenger: true },
        orderBy: { loginTime: "desc" },
        skip,
        take: limitNum,
      }),
    ]);

    res.status(200).json({
      success: true,
      logs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
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
// GET /login-logs/drivers - Audit endpoint for driver login logs
// ===========================
export const getDriverLoginLogs = async (req, res) => {
  try {
    const { driverId, status, page, limit } = req.query;

    const where = {};
    if (driverId) where.driverId = Number(driverId);
    if (status) where.status = status;

    const pageNum = Math.max(Number(page) || 1, 1);
    const limitNum = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const skip = (pageNum - 1) * limitNum;

    const [total, logs] = await Promise.all([
      prisma.driverLoginLog.count({ where }),
      prisma.driverLoginLog.findMany({
        where,
        include: { driver: true },
        orderBy: { loginTime: "desc" },
        skip,
        take: limitNum,
      }),
    ]);

    res.status(200).json({
      success: true,
      logs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
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
// POST /login-logs — Internal / Auth-triggered log entry
// ===========================
export const createLoginLog = async (req, res) => {
  try {
    const { userType, userId, status } = req.body;

    if (!userType || !userId) {
      return res.status(400).json({
        success: false,
        message: "userType (PASSENGER or DRIVER) and userId are required",
      });
    }

    let log = null;
    if (userType.toUpperCase() === "DRIVER") {
      log = await recordDriverLoginLog({ driverId: userId, status });
    } else {
      log = await recordPassengerLoginLog({ passengerId: userId, status });
    }

    res.status(201).json({
      success: true,
      message: "Login log recorded successfully",
      log,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
