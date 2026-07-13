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

    

   // Check if bus is already assigned in the selected date range
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

    // Prevent assigning the same driver twice
   // Check if driver is already assigned in the selected date range
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

    const assignment = await prisma.busAssignment.create({
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

    await prisma.busAssignment.delete({
      where: {
        id,
      },
    });

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

