import { prisma } from "../config/prisma.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to save base64 photo to static uploads directory
const saveBase64Image = (base64Data) => {
  try {
    const uploadDir = path.join(__dirname, "../uploads/issues");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let buffer;
    let extension = "jpg";

    if (matches && matches.length === 3) {
      const mime = matches[1];
      if (mime.includes("png")) extension = "png";
      else if (mime.includes("jpeg") || mime.includes("jpg")) extension = "jpg";
      else if (mime.includes("webp")) extension = "webp";
      buffer = Buffer.from(matches[2], "base64");
    } else {
      buffer = Buffer.from(base64Data, "base64");
    }

    const fileName = `issue_${Date.now()}_${Math.floor(Math.random() * 1000)}.${extension}`;
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, buffer);

    return `/uploads/issues/${fileName}`;
  } catch (err) {
    console.error("Error saving base64 image:", err);
    return null;
  }
};

// POST /issues — Driver reports an operational issue
export const createIssue = async (req, res) => {
  try {
    const { category, severity, description, photo, photoUrl, driverId, tripId } = req.body;

    if (!category || !description) {
      return res.status(400).json({
        success: false,
        message: "Category and description are required.",
      });
    }

    let finalPhotoUrl = photoUrl || null;
    if (photo && photo.length > 50) {
      const savedPath = saveBase64Image(photo);
      if (savedPath) {
        finalPhotoUrl = savedPath;
      }
    }

    // Resolve driver ID & Driver record
    let driverObj = null;
    let parsedDriverId = driverId ? Number(driverId) : null;

    if (parsedDriverId && !isNaN(parsedDriverId)) {
      driverObj = await prisma.driver.findUnique({ where: { id: parsedDriverId } });
    }
    if (!driverObj && req.user?.id) {
      const uId = Number(req.user.id);
      if (!isNaN(uId)) {
        driverObj = await prisma.driver.findUnique({ where: { id: uId } });
        if (driverObj) parsedDriverId = driverObj.id;
      }
    }
    if (!driverObj && req.user?.firebaseUid) {
      driverObj = await prisma.driver.findUnique({
        where: { firebaseUid: req.user.firebaseUid },
      });
      if (driverObj) parsedDriverId = driverObj.id;
    }
    if (!driverObj && req.user?.email) {
      driverObj = await prisma.driver.findUnique({
        where: { email: req.user.email },
      });
      if (driverObj) parsedDriverId = driverObj.id;
    }
    if (!driverObj && (req.body.driverName || req.body.driver)) {
      const searchName = req.body.driverName || req.body.driver;
      driverObj = await prisma.driver.findFirst({
        where: { name: { contains: searchName, mode: "insensitive" } },
      });
      if (driverObj) parsedDriverId = driverObj.id;
    }
    if (!driverObj) {
      const firstDriver = await prisma.driver.findFirst();
      if (firstDriver) {
        driverObj = firstDriver;
        parsedDriverId = firstDriver.id;
      }
    }

    const dynamicDriverName = driverObj?.name || req.body.driverName || req.body.driver || "Driver";

    // Resolve active trip ID
    let parsedTripId = tripId ? Number(tripId) : null;
    if (!parsedTripId && parsedDriverId) {
      const activeTrip = await prisma.trip.findFirst({
        where: { driverId: parsedDriverId, endedAt: null },
        orderBy: { startedAt: "desc" },
      });
      if (activeTrip) parsedTripId = activeTrip.id;
    }

    const issueModel = prisma.issue || prisma.Issue;
    if (!issueModel) {
      throw new Error("Issue model is not initialized on Prisma client.");
    }

    const issue = await issueModel.create({
      data: {
        category,
        severity: severity || "Medium",
        description: description.trim(),
        photoUrl: finalPhotoUrl,
        driverId: parsedDriverId,
        tripId: parsedTripId,
        status: "PENDING",
      },
      include: {
        driver: true,
        trip: {
          include: {
            bus: true,
            route: true,
          },
        },
      },
    });

    // 1. Notify Admins
    try {
      const admins = await prisma.admin.findMany();
      const photoSuffix = finalPhotoUrl ? ` [Photo: ${finalPhotoUrl}]` : "";
      const adminNotifTitle = `🚨 DRIVER ISSUE REPORTED: ${category.toUpperCase()}`;
      const adminNotifMsg = `Driver ${dynamicDriverName} reported a ${severity || "Medium"} issue: "${description.trim()}".${photoSuffix}`;

      if (admins.length > 0) {
        for (const admin of admins) {
          await prisma.notification.create({
            data: {
              adminId: admin.id,
              title: adminNotifTitle,
              message: adminNotifMsg,
            },
          });
        }
      } else {
        await prisma.notification.create({
          data: {
            adminId: 1,
            title: adminNotifTitle,
            message: adminNotifMsg,
          },
        });
      }
    } catch (adminNotifErr) {
      console.error("Error sending admin issue notifications:", adminNotifErr);
    }

    // 2. Notify Waiting Passengers
    try {
      const passengers = await prisma.passenger.findMany({ take: 100 });
      const busInfo = issue.trip?.bus?.busNumber ? ` (Bus ${issue.trip.bus.busNumber})` : "";
      const routeInfo = issue.trip?.route?.routeName ? ` on ${issue.trip.route.routeName}` : "";
      const passengerNotifTitle = `🚌 BUS DELAY ALERT`;
      const passengerNotifMsg = `Notice to passengers: Bus${busInfo}${routeInfo} has reported an issue (${category}). Schedules may be affected.`;

      for (const passenger of passengers) {
        await prisma.notification.create({
          data: {
            passengerId: passenger.id,
            title: passengerNotifTitle,
            message: passengerNotifMsg,
          },
        });
      }
    } catch (passengerNotifErr) {
      console.error("Error notifying waiting passengers:", passengerNotifErr);
    }

    res.status(201).json({
      success: true,
      message: "Operational issue reported successfully. Admins and passengers have been notified.",
      issue,
    });
  } catch (error) {
    console.error("Create Issue Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /issues — Retrieve all reported issues
export const getIssues = async (req, res) => {
  try {
    const issueModel = prisma.issue || prisma.Issue;
    if (!issueModel) {
      return res.status(200).json({ success: true, count: 0, issues: [] });
    }

    const issues = await issueModel.findMany({
      include: {
        driver: true,
        trip: {
          include: {
            bus: true,
            route: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: issues.length,
      issues,
    });
  } catch (error) {
    console.error("Get Issues Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /issues/:id — Retrieve issue by ID
export const getIssueById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid Issue ID" });
    }

    const issueModel = prisma.issue || prisma.Issue;
    const issue = await issueModel.findUnique({
      where: { id },
      include: {
        driver: true,
        trip: {
          include: {
            bus: true,
            route: true,
          },
        },
      },
    });

    if (!issue) {
      return res.status(404).json({ success: false, message: "Issue not found" });
    }

    res.status(200).json({
      success: true,
      issue,
    });
  } catch (error) {
    console.error("Get Issue By ID Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// PATCH /issues/:id/status — Update issue status
export const updateIssueStatus = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid Issue ID" });
    }

    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required" });
    }

    const issueModel = prisma.issue || prisma.Issue;
    const updatedIssue = await issueModel.update({
      where: { id },
      data: { status },
      include: {
        driver: true,
        trip: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Issue status updated successfully",
      issue: updatedIssue,
    });
  } catch (error) {
    console.error("Update Issue Status Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
