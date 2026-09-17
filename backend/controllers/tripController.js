import { prisma } from "../config/prisma.js";

// ===========================
// Get All Trips
// ===========================
export const getTrips = async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      include: {
        route: true,
        driver: true,
        bus: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    res.status(200).json({
      success: true,
      trips,
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
// Get Trip By ID
// ===========================
export const getTripById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        route: true,
        driver: true,
        bus: true,
        tripHistory: true,
      },
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    res.status(200).json({
      success: true,
      trip,
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
// Create Trip
// ===========================
export const createTrip = async (req, res) => {
  try {
    const { routeId, driverId, busId } = req.body;

    const route = await prisma.route.findUnique({
      where: { id: Number(routeId) },
    });

    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found",
      });
    }

    const driver = await prisma.driver.findUnique({
      where: { id: Number(driverId) },
    });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    const bus = await prisma.bus.findUnique({
      where: { id: Number(busId) },
    });

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    const trip = await prisma.trip.create({
      data: {
        routeId: Number(routeId),
        driverId: Number(driverId),
        busId: Number(busId),
        startedAt: new Date(),
      },
      include: {
        route: true,
        driver: true,
        bus: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Trip created successfully",
      trip,
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
// Update Trip
// ===========================
export const updateTrip = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const { routeId, driverId, busId } = req.body;

    const trip = await prisma.trip.update({
      where: { id },
      data: {
        routeId: Number(routeId),
        driverId: Number(driverId),
        busId: Number(busId),
      },
      include: {
        route: true,
        driver: true,
        bus: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Trip updated successfully",
      trip,
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
// End Trip
// ===========================
export const endTrip = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const trip = await prisma.trip.update({
      where: { id },
      data: {
        endedAt: new Date(),
      },
    });

    res.status(200).json({
      success: true,
      message: "Trip ended successfully",
      trip,
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
// Delete Trip
// ===========================
export const deleteTrip = async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.trip.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Trip deleted successfully",
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
// Trip Count
// ===========================
export const getTripCount = async (req, res) => {
  try {
    const count = await prisma.trip.count();

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

// ===========================
// Recent Trips
// ===========================
export const getRecentTrips = async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      include: {
        route: true,
        driver: true,
        bus: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    res.status(200).json({
      success: true,
      trips,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
