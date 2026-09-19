import { prisma } from "../config/prisma.js";

// Helper to get passenger ID from request token
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
    if (req.user?.email) {
      const p = await prisma.passenger.findUnique({
        where: { email: req.user.email },
      });
      if (p) return p.id;
    }
    const firstPassenger = await prisma.passenger.findFirst();
    return firstPassenger?.id || 1;
  } catch (err) {
    console.error("getPassengerIdFromReq Error:", err.message);
    const firstPassenger = await prisma.passenger.findFirst();
    return firstPassenger?.id || 1;
  }
};

// ==========================================
// POST /sos — Passenger/Driver triggers SOS alert
// ==========================================
export const createSOSAlert = async (req, res) => {
  try {
    const { latitude, longitude, message } = req.body;
    let passengerId = req.body.passengerId || (await getPassengerIdFromReq(req));

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: "latitude and longitude are required",
      });
    }

    if (!passengerId) {
      const fallbackPassenger = await prisma.passenger.findFirst();
      passengerId = fallbackPassenger?.id || 1;
    }

    // Fetch emergency contacts for this passenger (up to 2)
    const emergencyContacts = await prisma.sOSContact.findMany({
      where: { passengerId: Number(passengerId) },
      take: 2,
    });

    const sos = await prisma.sOS.create({
      data: {
        passengerId: Number(passengerId),
        latitude: Number(latitude),
        longitude: Number(longitude),
        message: message || "EMERGENCY SOS ALERT TRIGGERED",
        status: "PENDING",
      },
      include: {
        passenger: {
          include: {
            sosContacts: true,
          },
        },
      },
    });

    // Create system notification for Admins
    const contactText = emergencyContacts.length > 0
      ? emergencyContacts.map((c) => `${c.contactName} (${c.contactNumber})`).join(", ")
      : "No Emergency Contacts Registered";

    try {
      const firstAdmin = await prisma.admin.findFirst();
      await prisma.notification.create({
        data: {
          adminId: firstAdmin ? firstAdmin.id : 1,
          passengerId: Number(passengerId),
          title: "🚨 LIVE SOS EMERGENCY ALERT",
          message: `Emergency Triggered by ${sos.passenger?.name || "Passenger"} (${sos.passenger?.phone || "No Phone"}). Contacts: [${contactText}]. Coords: ${latitude}, ${longitude}. Note: ${message || "Help Requested"}`,
        },
      });
    } catch (notifErr) {
      console.error("Failed to create admin notification:", notifErr);
    }

    res.status(201).json({
      success: true,
      message: "SOS Alert Triggered Successfully!",
      sos: {
        ...sos,
        emergencyContacts,
      },
    });
  } catch (error) {
    console.error("SOS Creation Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET /sos — Admin / Dispatch Live SOS Queue
// ==========================================
export const getSOSQueue = async (req, res) => {
  try {
    const { status } = req.query;

    const where = {};
    if (status) {
      where.status = status;
    }

    if (req.user?.role === "PASSENGER") {
      const passengerId = await getPassengerIdFromReq(req);
      if (passengerId) where.passengerId = passengerId;
    }

    const sosAlerts = await prisma.sOS.findMany({
      where,
      include: {
        passenger: {
          include: {
            sosContacts: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: sosAlerts.length,
      pendingCount: sosAlerts.filter((s) => s.status === "PENDING").length,
      sosAlerts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET /sos/:id — Ticket Detail / Dispatch Preview
// ==========================================
export const getSOSById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid SOS ID" });
    }

    const sos = await prisma.sOS.findUnique({
      where: { id },
      include: {
        passenger: {
          include: {
            sosContacts: true,
          },
        },
      },
    });

    if (!sos) {
      return res.status(404).json({
        success: false,
        message: "SOS record not found",
      });
    }

    res.status(200).json({
      success: true,
      sos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// PATCH /sos/:id/status — Update SOS status (PENDING / IN_PROGRESS / RESOLVED)
// ==========================================
export const updateSOSStatus = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid SOS ID" });
    }

    if (!["PENDING", "IN_PROGRESS", "RESOLVED"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "status must be PENDING, IN_PROGRESS, or RESOLVED",
      });
    }

    const sos = await prisma.sOS.update({
      where: { id },
      data: { status },
      include: { passenger: true },
    });

    res.status(200).json({
      success: true,
      message: `SOS status updated to ${status}`,
      sos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Trusted SOS Contacts Management
// ==========================================

// GET /sos-contacts
export const getSOSContacts = async (req, res) => {
  try {
    let passengerId = req.query.passengerId || (await getPassengerIdFromReq(req));

    const where = {};
    if (passengerId) where.passengerId = Number(passengerId);

    const contacts = await prisma.sOSContact.findMany({
      where,
      orderBy: { id: "desc" },
    });

    res.status(200).json({
      success: true,
      count: contacts.length,
      contacts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// POST /sos-contacts
export const createSOSContact = async (req, res) => {
  try {
    const { contactName, contactNumber, relationship } = req.body;
    let passengerId = req.body.passengerId || (await getPassengerIdFromReq(req));

    if (!contactName || !contactNumber) {
      return res.status(400).json({
        success: false,
        message: "contactName and contactNumber are required",
      });
    }

    if (!passengerId) {
      const fallbackPassenger = await prisma.passenger.findFirst();
      passengerId = fallbackPassenger?.id || 1;
    }

    const existingCount = await prisma.sOSContact.count({
      where: { passengerId: Number(passengerId) },
    });

    if (existingCount >= 2) {
      return res.status(400).json({
        success: false,
        message: "Maximum 2 emergency contacts allowed per passenger",
      });
    }

    const contact = await prisma.sOSContact.create({
      data: {
        passengerId: Number(passengerId),
        contactName,
        contactNumber,
        relationship: relationship || "Family",
      },
    });

    res.status(201).json({
      success: true,
      message: "SOS Contact Added Successfully",
      contact,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// PATCH / PUT /sos-contacts/:id
export const updateSOSContact = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { contactName, contactNumber, relationship } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid Contact ID" });
    }

    const data = {};
    if (contactName !== undefined) data.contactName = contactName;
    if (contactNumber !== undefined) data.contactNumber = contactNumber;
    if (relationship !== undefined) data.relationship = relationship;

    const contact = await prisma.sOSContact.update({
      where: { id },
      data,
    });

    res.status(200).json({
      success: true,
      message: "SOS Contact Updated Successfully",
      contact,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE /sos-contacts/:id
export const deleteSOSContact = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid Contact ID" });
    }

    await prisma.sOSContact.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "SOS Contact Deleted Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
