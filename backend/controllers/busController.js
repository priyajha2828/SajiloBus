import { prisma } from "../config/prisma.js";

// Haversine distance helper in km
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// ==========================
// Get All Buses (with optional search, status filter, pagination)
// ==========================
export const getBuses = async (req, res) => {
  try {
    const { search, status, page, limit } = req.query;

    const where = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { busNumber: { contains: search, mode: "insensitive" } },
        { plateNumber: { contains: search, mode: "insensitive" } },
      ];
    }

    const pageNum = page ? Math.max(Number(page) || 1, 1) : null;
    const limitNum = limit ? Math.min(Math.max(Number(limit) || 10, 1), 100) : null;
    const skip = pageNum && limitNum ? (pageNum - 1) * limitNum : undefined;

    const [buses, total] = await Promise.all([
      prisma.bus.findMany({
        where,
        include: {
          assignments: {
            where: { assignedTo: null },
            include: { driver: true },
            take: 1,
          },
          trips: {
            where: { endedAt: null },
            include: { route: true },
            take: 1,
          },
        },
        orderBy: { id: "desc" },
        ...(skip !== undefined ? { skip } : {}),
        ...(limitNum ? { take: limitNum } : {}),
      }),
      prisma.bus.count({ where }),
    ]);

    const formattedBuses = buses.map((bus) => ({
      ...bus,
      currentDriver: bus.assignments[0]?.driver || null,
      activeTrip: bus.trips[0] || null,
    }));

    res.status(200).json({
      success: true,
      buses: formattedBuses,
      ...(pageNum && limitNum
        ? {
            pagination: {
              page: pageNum,
              limit: limitNum,
              total,
              totalPages: Math.ceil(total / limitNum),
            },
          }
        : { total }),
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
      where: { id },
      include: {
        assignments: {
          include: { driver: true },
          orderBy: { assignedFrom: "desc" },
        },
        trips: {
          include: {
            route: true,
            driver: true,
            tripHistory: {
              orderBy: { recordedAt: "desc" },
              take: 1,
            },
          },
          orderBy: { startedAt: "desc" },
          take: 10,
        },
        schedules: {
          include: { route: true },
        },
      },
    });

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    const activeTrip = bus.trips.find((t) => t.endedAt === null) || null;
    const currentAssignment =
      bus.assignments.find((a) => a.assignedTo === null) || bus.assignments[0] || null;

    res.status(200).json({
      success: true,
      bus: {
        ...bus,
        currentDriver: currentAssignment?.driver || null,
        activeTrip,
      },
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
// GET /buses/nearby - Passenger Dashboard "Nearby Real-time Buses"
// ==========================
export const getNearbyBuses = async (req, res) => {
  try {
    const { lat, lng, radiusKm } = req.query;

    const userLat = Number(lat);
    const userLng = Number(lng);
    const maxRadius = Number(radiusKm) || 10; // Default 10km radius

    // Fetch active trips with their bus, driver, route, and latest location ping
    const activeTrips = await prisma.trip.findMany({
      where: {
        endedAt: null,
      },
      include: {
        bus: true,
        driver: true,
        route: true,
        tripHistory: {
          orderBy: { recordedAt: "desc" },
          take: 1,
        },
      },
    });

    let nearbyBuses = activeTrips
      .filter((trip) => trip.tripHistory && trip.tripHistory.length > 0)
      .map((trip) => {
        const latestPing = trip.tripHistory[0];
        const pingLat = Number(latestPing.latitude);
        const pingLng = Number(latestPing.longitude);

        let distanceKm = null;
        if (!isNaN(userLat) && !isNaN(userLng)) {
          distanceKm = Math.round(calculateDistance(userLat, userLng, pingLat, pingLng) * 100) / 100;
        }

        return {
          busId: trip.bus.id,
          busNumber: trip.bus.busNumber,
          plateNumber: trip.bus.plateNumber,
          capacity: trip.bus.capacity,
          busStatus: trip.bus.status,
          driver: {
            id: trip.driver.id,
            name: trip.driver.name,
            phone: trip.driver.phone,
          },
          route: {
            id: trip.route.id,
            routeName: trip.route.routeName,
            startPoint: trip.route.startPoint,
            endPoint: trip.route.endPoint,
          },
          activeTripId: trip.id,
          currentLocation: {
            latitude: pingLat,
            longitude: pingLng,
            recordedAt: latestPing.recordedAt,
          },
          distanceKm,
        };
      });

    // Filter by radius if user lat/lng supplied
    if (!isNaN(userLat) && !isNaN(userLng)) {
      nearbyBuses = nearbyBuses
        .filter((b) => b.distanceKm !== null && b.distanceKm <= maxRadius)
        .sort((a, b) => a.distanceKm - b.distanceKm);
    }

    res.status(200).json({
      success: true,
      count: nearbyBuses.length,
      buses: nearbyBuses,
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
// Create Bus (Admin)
// ==========================
export const createBus = async (req, res) => {
  try {
    const { busNumber, plateNumber, capacity, status } = req.body;

    if (!busNumber) {
      return res.status(400).json({
        success: false,
        message: "busNumber is required",
      });
    }

    const bus = await prisma.bus.create({
      data: {
        busNumber,
        plateNumber: plateNumber || null,
        capacity: capacity ? Number(capacity) : null,
        status: status || "ACTIVE",
      },
    });

    // Optional Notification
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
    if (error.code === "P2002") {
      return res.status(400).json({
        success: false,
        message: "Bus number or plate number already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Update Bus (Admin - PUT or PATCH)
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

    const { busNumber, plateNumber, capacity, status } = req.body;

    const data = {};
    if (busNumber !== undefined) data.busNumber = busNumber;
    if (plateNumber !== undefined) data.plateNumber = plateNumber;
    if (capacity !== undefined) data.capacity = Number(capacity);
    if (status !== undefined) data.status = status;

    const bus = await prisma.bus.update({
      where: { id },
      data,
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
// Delete Bus (Admin)
// ==========================
export const deleteBus = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Bus ID",
      });
    }

    const bus = await prisma.bus.findUnique({
      where: { id },
    });

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    // Clean up dependent records before deletion
    await prisma.busAssignment.deleteMany({ where: { busId: id } });
    
    // For trips, delete tripHistory and stopEvents first
    const trips = await prisma.trip.findMany({ where: { busId: id }, select: { id: true } });
    const tripIds = trips.map((t) => t.id);
    if (tripIds.length > 0) {
      await prisma.tripStopEvent.deleteMany({ where: { tripId: { in: tripIds } } });
      await prisma.tripHistory.deleteMany({ where: { tripId: { in: tripIds } } });
      await prisma.trip.deleteMany({ where: { busId: id } });
    }

    await prisma.busSchedule.deleteMany({ where: { busId: id } });

    await prisma.bus.delete({
      where: { id },
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

// ==========================
// Live Bus Locations (Legacy support)
// ==========================
export const getLiveBusLocations = async (req, res) => {
  return getNearbyBuses(req, res);
};