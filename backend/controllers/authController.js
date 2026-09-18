import { prisma } from "../config/prisma.js";
import { getAuth } from "../config/firebase.js";
import jwt from "jsonwebtoken";

// Helper to generate JWT Token
const generateToken = (user, role) => {
  return jwt.sign(
    {
      id: user.id,
      role: role || user.role || "PASSENGER",
      firebaseUid: user.firebaseUid,
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ==========================================
// POST /auth/login — Common Unified Login (Admin, Driver, Passenger)
// ==========================================
export const commonLogin = async (req, res) => {
  try {
    const { idToken, email: bodyEmail } = req.body;

    let firebaseUid = null;
    let email = bodyEmail || null;
    let decodedName = null;

    if (idToken) {
      try {
        const decodedToken = await getAuth().verifyIdToken(idToken);
        firebaseUid = decodedToken.uid;
        email = decodedToken.email || email;
        decodedName = decodedToken.name || null;
      } catch (fbErr) {
        console.warn("Firebase token verify failed, falling back to body match:", fbErr.message);
      }
    }

    if (!firebaseUid && !email) {
      return res.status(400).json({
        success: false,
        message: "idToken or email is required for login",
      });
    }

    // 1. Check Admin (Admin is seeded and has role ADMIN)
    let admin = null;
    if (firebaseUid) {
      admin = await prisma.admin.findUnique({ where: { firebaseUid } });
    }
    if (!admin && email) {
      admin = await prisma.admin.findUnique({ where: { email } });
    }

    if (admin) {
      // Link firebaseUid if missing
      if (firebaseUid && (!admin.firebaseUid || admin.firebaseUid !== firebaseUid)) {
        admin = await prisma.admin.update({
          where: { id: admin.id },
          data: { firebaseUid },
        });
      }

      const token = generateToken(admin, "ADMIN");
      return res.status(200).json({
        success: true,
        message: "Admin Login Successful",
        role: "ADMIN",
        token,
        user: { ...admin, role: "ADMIN" },
      });
    }

    // 2. Check Driver (Drivers created by Admin have role DRIVER)
    let driver = null;
    if (firebaseUid) {
      driver = await prisma.driver.findUnique({ where: { firebaseUid } });
    }
    if (!driver && email) {
      driver = await prisma.driver.findUnique({ where: { email } });
    }

    if (driver) {
      // Link firebaseUid if missing
      if (firebaseUid && (!driver.firebaseUid || driver.firebaseUid !== firebaseUid)) {
        driver = await prisma.driver.update({
          where: { id: driver.id },
          data: { firebaseUid },
        });
      }

      // Record audit log
      try {
        await prisma.driverLoginLog.create({
          data: { driverId: driver.id, loginTime: new Date(), status: "SUCCESS" },
        });
      } catch (err) {
        console.log("Driver Login Log Error:", err.message);
      }

      const token = generateToken(driver, "DRIVER");
      return res.status(200).json({
        success: true,
        message: "Driver Login Successful",
        role: "DRIVER",
        token,
        user: { ...driver, role: "DRIVER" },
      });
    }

    // 3. Check Passenger (Passenger signup / user manually signs up)
    let passenger = null;
    if (firebaseUid) {
      passenger = await prisma.passenger.findUnique({ where: { firebaseUid } });
    }
    if (!passenger && email) {
      passenger = await prisma.passenger.findUnique({ where: { email } });
    }

    if (passenger) {
      if (firebaseUid && (!passenger.firebaseUid || passenger.firebaseUid !== firebaseUid)) {
        passenger = await prisma.passenger.update({
          where: { id: passenger.id },
          data: { firebaseUid },
        });
      }

      // Record audit log
      try {
        await prisma.passengerLoginLog.create({
          data: { passengerId: passenger.id, loginTime: new Date(), status: "SUCCESS" },
        });
      } catch (err) {
        console.log("Passenger Login Log Error:", err.message);
      }

      const token = generateToken(passenger, "PASSENGER");
      return res.status(200).json({
        success: true,
        message: "Passenger Login Successful",
        role: "PASSENGER",
        token,
        user: { ...passenger, role: "PASSENGER" },
      });
    }

    // 4. If not found in any of the 3 tables and we have firebaseUid, auto-create Passenger account
    if (firebaseUid && email) {
      passenger = await prisma.passenger.create({
        data: {
          firebaseUid,
          email,
          name: decodedName || email.split("@")[0] || "New Passenger",
          role: "PASSENGER",
        },
      });

      try {
        await prisma.passengerLoginLog.create({
          data: { passengerId: passenger.id, loginTime: new Date(), status: "SUCCESS" },
        });
      } catch (err) {
        console.log("Passenger Login Log Error:", err.message);
      }

      const token = generateToken(passenger, "PASSENGER");
      return res.status(201).json({
        success: true,
        message: "New Passenger Account Created & Login Successful",
        role: "PASSENGER",
        token,
        user: { ...passenger, role: "PASSENGER" },
      });
    }

    return res.status(404).json({
      success: false,
      message: "User account not found. Please sign up.",
    });
  } catch (error) {
    console.error("Common Login Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// POST /auth/signup — Manual Signup for Passenger
// ==========================================
export const commonSignup = async (req, res) => {
  try {
    const { idToken, name, email: bodyEmail, phone } = req.body;

    let firebaseUid = null;
    let email = bodyEmail || null;

    if (idToken) {
      const decodedToken = await getAuth().verifyIdToken(idToken);
      firebaseUid = decodedToken.uid;
      email = decodedToken.email || email;
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email or idToken is required for signup",
      });
    }

    // Check existing across tables
    const [existingAdmin, existingDriver, existingPassenger] = await Promise.all([
      prisma.admin.findFirst({ where: { OR: [...(firebaseUid ? [{ firebaseUid }] : []), { email }] } }),
      prisma.driver.findFirst({ where: { OR: [...(firebaseUid ? [{ firebaseUid }] : []), { email }] } }),
      prisma.passenger.findFirst({ where: { OR: [...(firebaseUid ? [{ firebaseUid }] : []), { email }] } }),
    ]);

    if (existingAdmin) {
      return res.status(400).json({ success: false, message: "Email registered as Admin" });
    }
    if (existingDriver) {
      return res.status(400).json({ success: false, message: "Email registered as Driver" });
    }
    if (existingPassenger) {
      const token = generateToken(existingPassenger, "PASSENGER");
      return res.status(200).json({
        success: true,
        message: "User already registered. Logging in...",
        role: "PASSENGER",
        token,
        user: { ...existingPassenger, role: "PASSENGER" },
      });
    }

    // Create new Passenger
    const passenger = await prisma.passenger.create({
      data: {
        firebaseUid: firebaseUid || `uid_${Date.now()}`,
        email,
        name: name || email.split("@")[0] || "User",
        phone: phone || null,
        role: "PASSENGER",
      },
    });

    const token = generateToken(passenger, "PASSENGER");

    res.status(201).json({
      success: true,
      message: "Passenger Registered Successfully",
      role: "PASSENGER",
      token,
      user: { ...passenger, role: "PASSENGER" },
    });
  } catch (error) {
    console.error("Common Signup Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET /auth/me — Current Authenticated Profile (Admin, Driver, or Passenger)
// ==========================================
export const getMe = async (req, res) => {
  try {
    const { role, id, firebaseUid, email } = req.user;

    let user = null;

    if (role === "ADMIN") {
      if (id) user = await prisma.admin.findUnique({ where: { id: Number(id) } });
      else if (firebaseUid) user = await prisma.admin.findUnique({ where: { firebaseUid } });
    } else if (role === "DRIVER") {
      if (id) user = await prisma.driver.findUnique({ where: { id: Number(id) } });
      else if (firebaseUid) user = await prisma.driver.findUnique({ where: { firebaseUid } });
    } else {
      if (id) user = await prisma.passenger.findUnique({ where: { id: Number(id) } });
      else if (firebaseUid) user = await prisma.passenger.findUnique({ where: { firebaseUid } });
    }

    if (!user && email) {
      if (role === "ADMIN") user = await prisma.admin.findUnique({ where: { email } });
      else if (role === "DRIVER") user = await prisma.driver.findUnique({ where: { email } });
      else user = await prisma.passenger.findUnique({ where: { email } });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User profile not found",
      });
    }

    res.status(200).json({
      success: true,
      role: role || user.role,
      user: {
        ...user,
        role: role || user.role,
      },
    });
  } catch (error) {
    console.error("GetMe Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
