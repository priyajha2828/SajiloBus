import {prisma} from "../config/prisma.js";

// ==========================
// Get All Buses
// ==========================

export const getBuses = async (req, res) => {
  try {
    const buses = await prisma.bus.findMany({
      orderBy: {
        id: "desc",
      },
    });

    res.status(200).json({
      success: true,
      buses,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Get Bus By ID
// ==========================

export const getBusById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Bus ID",
      });
    }

    const bus = await prisma.bus.findUnique({
      where: {
        id,
      },
    });

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    res.status(200).json({
      success: true,
      bus,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Create Bus
// ==========================

export const createBus = async (req, res) => {
  try {
    const {
      busNumber,
      plateNumber,
      capacity,
      status,
    } = req.body;

    const bus = await prisma.bus.create({
      data: {
        busNumber,
        plateNumber,
        capacity: Number(capacity),
        status,
      },
    });

    // Create Notification
    try {
      await prisma.notification.create({
        data: {
          adminId: 1,
          passengerId: 1,
          title: "New Bus Added",
          message: `${bus.busNumber} has been added successfully.`,
        },
      });
    } catch (err) {
      console.log("Notification Error:", err.message);
    }

    res.status(201).json({
      success: true,
      message: "Bus Added Successfully",
      bus,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Update Bus
// ==========================

export const updateBus = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Bus ID",
      });
    }

    const {
      busNumber,
      plateNumber,
      capacity,
      status,
    } = req.body;

    const bus = await prisma.bus.update({
      where: {
        id,
      },
      data: {
        busNumber,
        plateNumber,
        capacity: Number(capacity),
        status,
      },
    });

    res.status(200).json({
      success: true,
      message: "Bus Updated Successfully",
      bus,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Delete Bus
// ==========================

export const deleteBus = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const bus = await prisma.bus.findUnique({
      where: { id },
    });

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    // Delete related Bus Assignments
    await prisma.busAssignment.deleteMany({
      where: {
        busId: id,
      },
    });

    // Delete related Trips
    await prisma.trip.deleteMany({
      where: {
        busId: id,
      },
    });

    // Delete related Bus Schedules
    await prisma.busSchedule.deleteMany({
      where: {
        busId: id,
      },
    });

    // Finally delete Bus
    await prisma.bus.delete({
      where: {
        id,
      },
    });

    res.json({
      success: true,
      message: "Bus Deleted Successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Bus Count
// ==========================

export const getBusCount = async (req, res) => {
  try {
    const count = await prisma.bus.count();

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

<<<<<<< HEAD
// ==========================
// Live Bus Locations
// ==========================

const getLiveBusLocations = async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      include: {
        bus: true,
        driver: true,
        tripHistory: {
          orderBy: {
            recordedAt: "desc",
          },
          take: 1,
        },
      },
    });

    const buses = trips.map((trip) => ({
      id: trip.bus.id,
      busNumber: trip.bus.busNumber,
      driver: trip.driver.name,
      status: trip.bus.status,
      latitude: trip.tripHistory[0]?.latitude,
      longitude: trip.tripHistory[0]?.longitude,
      updatedAt: trip.tripHistory[0]?.recordedAt,
    }));

    res.status(200).json({
      success: true,
      buses,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getBuses,
  getBusById,
  createBus,
  updateBus,
  deleteBus,
  getBusCount,
  getLiveBusLocations,
};
=======
// export default {
//   getBuses,
//   getBusById,
//   createBus,
//   updateBus,
//   deleteBus,
//   getBusCount,
// };
>>>>>>> 20c3ca8643a1b4b50975f40c9f1c67be8a464915
