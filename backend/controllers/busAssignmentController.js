import { prisma } from "../config/prisma.js";

// ===========================
// Get All Assignments
// ===========================

export const getAssignments = async (req, res) => {
  try {
    const assignments = await prisma.busAssignment.findMany({
      include: {
        driver: true,
        bus: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    res.status(200).json({
      success: true,
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
// Get Assignment By ID
// ===========================

export const getAssignmentById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const assignment = await prisma.busAssignment.findUnique({
      where: {
        id,
      },
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
// Create Assignment
// ===========================

export const createAssignment = async (req, res) => {
  try {
    const {
      driverId,
      busId,
      assignedFrom,
      assignedTo,
    } = req.body;

    // Check Driver
    const driver = await prisma.driver.findUnique({
      where: {
        id: Number(driverId),
      },
    });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    // Check Bus
    const bus = await prisma.bus.findUnique({
      where: {
        id: Number(busId),
      },
    });

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    // Check if Bus is already assigned
    const existingBus = await prisma.busAssignment.findFirst({
      where: {
        busId: Number(busId),
        AND: [
          {
            assignedFrom: {
              lte: new Date(assignedTo || assignedFrom),
            },
          },
          {
            OR: [
              {
                assignedTo: null,
              },
              {
                assignedTo: {
                  gte: new Date(assignedFrom),
                },
              },
            ],
          },
        ],
      },
    });

    if (existingBus) {
      return res.status(400).json({
        success: false,
        message: "Bus is already assigned during the selected period.",
      });
    }

    // Check if Driver is already assigned
    const existingDriver = await prisma.busAssignment.findFirst({
      where: {
        driverId: Number(driverId),
        AND: [
          {
            assignedFrom: {
              lte: new Date(assignedTo || assignedFrom),
            },
          },
          {
            OR: [
              {
                assignedTo: null,
              },
              {
                assignedTo: {
                  gte: new Date(assignedFrom),
                },
              },
            ],
          },
        ],
      },
    });

    if (existingDriver) {
      return res.status(400).json({
        success: false,
        message: "Driver is already assigned during the selected period.",
      });
    }

    // Create Assignment
    const assignment = await prisma.busAssignment.create({
      data: {
        driverId: Number(driverId),
        busId: Number(busId),
        assignedFrom: new Date(assignedFrom),
        assignedTo: assignedTo
          ? new Date(assignedTo)
          : null,
      },
      include: {
        driver: true,
        bus: true,
      },
    });

    // Create Notification
    try {
      await prisma.notification.create({
        data: {
          adminId: 1,
          passengerId: 1, // Temporary
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
// Update Assignment
// ===========================

export const updateAssignment = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const {
      driverId,
      busId,
      assignedFrom,
      assignedTo,
    } = req.body;

    // Check Assignment
    const existingAssignment = await prisma.busAssignment.findUnique({
      where: {
        id,
      },
    });

    if (!existingAssignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    // Check Driver
    const driver = await prisma.driver.findUnique({
      where: {
        id: Number(driverId),
      },
    });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    // Check Bus
    const bus = await prisma.bus.findUnique({
      where: {
        id: Number(busId),
      },
    });

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    const assignment = await prisma.busAssignment.update({
      where: {
        id,
      },
      data: {
        driverId: Number(driverId),
        busId: Number(busId),
        assignedFrom: new Date(assignedFrom),
        assignedTo: assignedTo ? new Date(assignedTo) : null,
      },
      include: {
        driver: true,
        bus: true,
      },
    });

    // Create Notification
    try {
      await prisma.notification.create({
        data: {
          adminId: 1,
          passengerId: 1, // Temporary
          title: "Bus Assignment Updated",
          message: `${assignment.bus.busNumber} assignment has been updated.`,
        },
      });
    } catch (err) {
      console.log("Notification Error:", err.message);
    }

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
// Delete Assignment
// ===========================

export const deleteAssignment = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const assignment = await prisma.busAssignment.findUnique({
      where: {
        id,
      },
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

    await prisma.busAssignment.delete({
      where: {
        id,
      },
    });

    // Create Notification
    try {
      await prisma.notification.create({
        data: {
          adminId: 1,
          passengerId: 1, // Temporary
          title: "Bus Assignment Deleted",
          message: `${assignment.bus.busNumber} assignment has been deleted.`,
        },
      });
    } catch (err) {
      console.log("Notification Error:", err.message);
    }

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

    res.status(200).json({
      success: true,
      count,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};