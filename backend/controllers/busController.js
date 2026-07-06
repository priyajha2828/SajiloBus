const prisma = require("../config/prisma");

// ==========================
// Get All Buses
// ==========================

const getBuses = async (req, res) => {
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

const getBusById = async (req, res) => {
  try {
    const id = Number(req.params.id);

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

const createBus = async (req, res) => {
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

const updateBus = async (req, res) => {
  try {
    const id = Number(req.params.id);

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

const deleteBus = async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.bus.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Bus Deleted Successfully",
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
// Bus Count
// ==========================

const getBusCount = async (req, res) => {
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

module.exports = {
  getBuses,
  getBusById,
  createBus,
  updateBus,
  deleteBus,
  getBusCount,
};