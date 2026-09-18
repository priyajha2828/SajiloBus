import { prisma } from "../config/prisma.js";

// Helper to get passenger ID from request token
const getPassengerIdFromReq = async (req) => {
  if (req.user?.role === "PASSENGER") {
    if (req.user?.id) return req.user.id;
    if (req.user?.firebaseUid) {
      const p = await prisma.passenger.findUnique({
        where: { firebaseUid: req.user.firebaseUid },
      });
      return p?.id || null;
    }
  }
  return null;
};

// ==========================================
// POST /sos — Passenger triggers SOS alert
// ==========================================
export const createSOSAlert = async (req, res) => {
  try {
    const { latitude, longitude, message } = req.body;
    let passengerId = req.body.passengerId || (await getPassengerIdFromReq(req));

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "latitude and longitude are required",
      });
    }

    if (!passengerId) {
      const fallbackPassenger = await prisma.passenger.findFirst();
      passengerId = fallbackPassenger?.id || 1;
    }

    const sos = await prisma.sOS.create({
      data: {
        passengerId: Number(passengerId),
        latitude: Number(latitude),
        longitude: Number(longitude),
        message: message || "EMERGENCY SOS ALERT TRIGGERED",
        status: "PENDING",
      },
      include: {
        passenger: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "SOS Alert Triggered Successfully!",
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
// GET /sos — Admin / Dispatch Live SOS Queue
// ==========================================
export const getSOSQueue = async (req, res) => {
  try {
    const { status } = req.query;

    const where = {};
    if (status) {
      where.status = status;
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
