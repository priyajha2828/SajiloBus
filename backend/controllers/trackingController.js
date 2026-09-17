import { prisma } from "../config/prisma.js";

// Update Driver Location
export const updateLocation = async (req, res) => {
  try {
    const { tripId, latitude, longitude } = req.body;

    if (!tripId || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Trip ID, latitude and longitude are required",
      });
    }

    const trip = await prisma.trip.findUnique({
      where: {
        id: Number(tripId),
      },
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    const location = await prisma.tripHistory.create({
      data: {
        tripId: Number(tripId),
        latitude: latitude,
        longitude: longitude,
      },
    });

    res.status(201).json({
      success: true,
      message: "Location Updated",
      location,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Latest Bus Location
export const getLatestLocation = async (req, res) => {
  try {
    const tripId = Number(req.params.tripId);

    const location = await prisma.tripHistory.findFirst({
      where: {
        tripId,
      },
      orderBy: {
        recordedAt: "desc",
      },
    });

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    res.status(200).json({
      success: true,
      location,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Route History
export const getTripHistory = async (req, res) => {
  try {
    const tripId = Number(req.params.tripId);

    const history = await prisma.tripHistory.findMany({
      where: {
        tripId,
      },
      orderBy: {
        recordedAt: "asc",
      },
    });

    res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
