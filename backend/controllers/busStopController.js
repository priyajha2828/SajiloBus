import { prisma } from "../config/prisma.js";
// ==============================
// Get All Bus Stops
// ==============================

export const getBusStops = async (req, res) => {
  try {
    const { search } = req.query;

    const busStops = await prisma.busStop.findMany({
      where: search
        ? {
            stopName: {
              contains: search,
              mode: "insensitive",
            },
          }
        : {},
      orderBy: {
        id: "desc",
      },
    });

    res.json({
      success: true,
      busStops,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch bus stops",
    });
  }
};

// ==============================
// Get Bus Stop By Id
// ==============================

export const getBusStopById = async (req, res) => {
  try {
    const { id } = req.params;

    const busStop = await prisma.busStop.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!busStop) {
      return res.status(404).json({
        success: false,
        message: "Bus Stop not found",
      });
    }

    res.json({
      success: true,
      busStop,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch bus stop",
    });
  }
};

// ==============================
// Create Bus Stop
// ==============================

export const createBusStop = async (req, res) => {
  try {
    const {
      stopName,
      latitude,
      longitude,
    } = req.body;

    const existing = await prisma.busStop.findFirst({
      where: {
        stopName,
      },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Bus Stop already exists",
      });
    }

    const busStop = await prisma.busStop.create({
      data: {
        stopName,
        latitude,
        longitude,
      },
    });

    res.status(201).json({
      success: true,
      message: "Bus Stop created successfully",
      busStop,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create bus stop",
    });
  }
};

// ==============================
// Update Bus Stop
// ==============================

export const updateBusStop = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      stopName,
      latitude,
      longitude,
    } = req.body;

    const existing = await prisma.busStop.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Bus Stop not found",
      });
    }

    const busStop = await prisma.busStop.update({
      where: {
        id: Number(id),
      },
      data: {
        stopName,
        latitude,
        longitude,
      },
    });

    res.json({
      success: true,
      message: "Bus Stop updated successfully",
      busStop,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update bus stop",
    });
  }
};

// ==============================
// Delete Bus Stop
// ==============================

export const deleteBusStop = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.busStop.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Bus Stop not found",
      });
    }

    await prisma.busStop.delete({
      where: {
        id: Number(id),
      },
    });

    res.json({
      success: true,
      message: "Bus Stop deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete bus stop",
    });
  }
};

// ==============================
// Bus Stop Count
// ==============================

export const getBusStopCount = async (req, res) => {
  try {
    const count = await prisma.busStop.count();

    res.json({
      success: true,
      count,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch count",
    });
  }
};