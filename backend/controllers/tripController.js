const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/* =========================================
   GET ALL TRIPS
========================================= */

const getTrips = async (req, res) => {
  try {
    const { search } = req.query;

    const trips = await prisma.trip.findMany({
      where: search
        ? {
            OR: [
              {
                driver: {
                  name: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              },
              {
                bus: {
                  busNumber: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              },
              {
                route: {
                  routeName: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              },
            ],
          }
        : {},
      include: {
        driver: true,
        bus: true,
        route: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    res.json({
      success: true,
      trips,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch trips.",
    });
  }
};

/* =========================================
   GET TRIP BY ID
========================================= */

const getTripById = async (req, res) => {
  try {
    const trip = await prisma.trip.findUnique({
      where: {
        id: Number(req.params.id),
      },
      include: {
        driver: true,
        bus: true,
        route: true,
      },
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found.",
      });
    }

    res.json({
      success: true,
      trip,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch trip.",
    });
  }
};

/* =========================================
   CREATE TRIP
========================================= */

const createTrip = async (req, res) => {
  try {
    const { driverId, busId, routeId } = req.body;

    // Check Driver
    const driver = await prisma.driver.findUnique({
      where: {
        id: Number(driverId),
      },
    });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found.",
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
        message: "Bus not found.",
      });
    }

    // Check Route
    const route = await prisma.route.findUnique({
      where: {
        id: Number(routeId),
      },
    });

    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found.",
      });
    }

    // Driver already running a trip
    const activeDriverTrip = await prisma.trip.findFirst({
      where: {
        driverId: Number(driverId),
        endedAt: null,
      },
    });

    if (activeDriverTrip) {
      return res.status(400).json({
        success: false,
        message: "Driver already has an active trip.",
      });
    }

    // Bus already running a trip
    const activeBusTrip = await prisma.trip.findFirst({
      where: {
        busId: Number(busId),
        endedAt: null,
      },
    });

    if (activeBusTrip) {
      return res.status(400).json({
        success: false,
        message: "Bus already has an active trip.",
      });
    }

    const trip = await prisma.trip.create({
      data: {
        driverId: Number(driverId),
        busId: Number(busId),
        routeId: Number(routeId),
        startedAt: new Date(),
      },
    });

    res.status(201).json({
      success: true,
      message: "Trip started successfully.",
      trip,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to create trip.",
    });
  }
};

/* =========================================
   END TRIP
========================================= */

const endTrip = async (req, res) => {
  try {
    const trip = await prisma.trip.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        endedAt: new Date(),
      },
    });

    res.json({
      success: true,
      message: "Trip ended successfully.",
      trip,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to end trip.",
    });
  }
};

/* =========================================
   DELETE TRIP
========================================= */

const deleteTrip = async (req, res) => {
  try {
    await prisma.trip.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    res.json({
      success: true,
      message: "Trip deleted successfully.",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete trip.",
    });
  }
};

/* =========================================
   UPDATE TRIP
========================================= */

const updateTrip = async (req, res) => {
  try {
    const { driverId, busId, routeId } = req.body;
    const { id } = req.params;

    const existingTrip = await prisma.trip.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!existingTrip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found.",
      });
    }

    const updatedTrip = await prisma.trip.update({
      where: {
        id: Number(id),
      },
      data: {
        driverId: Number(driverId),
        busId: Number(busId),
        routeId: Number(routeId),
      },
      include: {
        driver: true,
        bus: true,
        route: true,
      },
    });

    res.json({
      success: true,
      message: "Trip updated successfully.",
      trip: updatedTrip,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to update trip.",
    });
  }
};

/* =========================================
   COUNT
========================================= */

const getTripCount = async (req, res) => {
  try {
    const count = await prisma.trip.count();

    res.json({
      success: true,
      count,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to get trip count.",
    });
  }
};

const getRecentTrips = async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      include: {
        driver: true,
        bus: true,
      },
      orderBy: {
        startedAt: "desc",
      },
      take: 5,
    });

    res.json({
      success: true,
      trips,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch recent trips.",
    });
  }
};

module.exports = {
  getTrips,
  getTripById,
  createTrip,
  updateTrip,
  endTrip,
  deleteTrip,
  getTripCount,
  getRecentTrips,
};