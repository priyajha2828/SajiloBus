import { prisma } from "../config/prisma.js";

// ===========================
// GET /assignments?driverId=&busId=&activeOnly= — Who's driving what
// ===========================
export const getAssignments = async (req, res) => {
  try {
    const { driverId, busId, activeOnly } = req.query;

    const where = {};

    if (driverId) where.driverId = Number(driverId);
    if (busId) where.busId = Number(busId);

    if (activeOnly === "true") {
      where.OR = [
        { assignedTo: null },
        { assignedTo: { gte: new Date() } },
      ];
    }

    const assignments = await prisma.busAssignment.findMany({
      where,
      include: {
        driver: true,
        bus: true,
      },
      orderBy: {
        assignedFrom: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: assignments.length,
      assignments,
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
// GET /assignments/:id
// ===========================
export const getAssignmentById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid Assignment ID" });
    }

    const assignment = await prisma.busAssignment.findUnique({
      where: { id },
      include: {
        driver: true,
        bus: true,
      },
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
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
// POST /assignments — Admin assigns driver to bus
// ===========================
export const createAssignment = async (req, res) => {
  try {
    const { driverId, busId, assignedFrom, assignedTo } = req.body;

    if (!driverId || !busId) {
      return res.status(400).json({
        success: false,
        message: "driverId and busId are required",
      });
    }

    const driver = await prisma.driver.findUnique({ where: { id: Number(driverId) } });
    if (!driver) {
      return res.status(404).json({ success: false, message: "Driver not found" });
    }

    const bus = await prisma.bus.findUnique({ where: { id: Number(busId) } });
    if (!bus) {
      return res.status(404).json({ success: false, message: "Bus not found" });
    }

    const startTime = assignedFrom ? new Date(assignedFrom) : new Date();
    const endTime = assignedTo ? new Date(assignedTo) : null;

    // Check if Bus has an open assignment
    const existingBus = await prisma.busAssignment.findFirst({
      where: {
        busId: Number(busId),
        OR: [{ assignedTo: null }, { assignedTo: { gte: startTime } }],
      },
    });

    if (existingBus) {
      return res.status(400).json({
        success: false,
        message: "Bus is currently assigned to another driver.",
        existingAssignment: existingBus,
      });
    }

    // Check if Driver has an open assignment
    const existingDriver = await prisma.busAssignment.findFirst({
      where: {
        driverId: Number(driverId),
        OR: [{ assignedTo: null }, { assignedTo: { gte: startTime } }],
      },
    });

    if (existingDriver) {
      return res.status(400).json({
        success: false,
        message: "Driver is currently assigned to another bus.",
        existingAssignment: existingDriver,
      });
    }

    const assignment = await prisma.busAssignment.create({
      data: {
        driverId: Number(driverId),
        busId: Number(busId),
        assignedFrom: startTime,
        assignedTo: endTime,
      },
      include: {
        driver: true,
        bus: true,
      },
    });

    // Optional Notification
    try {
      await prisma.notification.create({
        data: {
          adminId: 1,
          passengerId: 1,
          title: "Bus Assigned",
          message: `${assignment.bus.busNumber} has been assigned to ${assignment.driver.name}.`,
        },
      });
    } catch (err) {
      console.log("Notification Error:", err.message);
    }

    res.status(201).json({
      success: true,
      message: "Bus Assigned Successfully",
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
// PATCH / PUT /assignments/:id — Admin update assignment / close out assignedTo
// ===========================
export const updateAssignment = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid Assignment ID" });
    }

    const existingAssignment = await prisma.busAssignment.findUnique({ where: { id } });
    if (!existingAssignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    const { driverId, busId, assignedFrom, assignedTo, closeNow } = req.body;

    const data = {};
    if (driverId !== undefined) data.driverId = Number(driverId);
    if (busId !== undefined) data.busId = Number(busId);
    if (assignedFrom !== undefined) data.assignedFrom = new Date(assignedFrom);

    if (closeNow === true) {
      data.assignedTo = new Date();
    } else if (assignedTo !== undefined) {
      data.assignedTo = assignedTo ? new Date(assignedTo) : null;
    }

    const assignment = await prisma.busAssignment.update({
      where: { id },
      data,
      include: {
        driver: true,
        bus: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Assignment Updated Successfully",
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
// DELETE /assignments/:id
// ===========================
export const deleteAssignment = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid Assignment ID" });
    }

    const assignment = await prisma.busAssignment.findUnique({ where: { id } });
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    await prisma.busAssignment.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: "Assignment Deleted Successfully",
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
// Assignment Count
// ===========================
export const getAssignmentCount = async (req, res) => {
  try {
    const count = await prisma.busAssignment.count();
    res.status(200).json({ success: true, count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};