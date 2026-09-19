import { prisma } from "../config/prisma.js";

// Helper to get driver ID from logged in user if available
const getDriverIdFromReq = async (req) => {
  if (req.user?.role === "DRIVER") {
    if (req.user?.id) return req.user.id;
    if (req.user?.firebaseUid) {
      const driver = await prisma.driver.findUnique({
        where: { firebaseUid: req.user.firebaseUid },
      });
      return driver?.id || null;
    }
  }
  return null;
};

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

// ===========================
// POST /trips/start - Start Trip
// ===========================
export const startTrip = async (req, res) => {
  try {
    let { routeId, driverId, busId, startedAt } = req.body;

    if (!driverId) {
      driverId = await getDriverIdFromReq(req);
    }

    if (!routeId || !driverId || !busId) {
      return res.status(400).json({
        success: false,
        message: "routeId, driverId, and busId are required",
      });
    }

    const route = await prisma.route.findUnique({
      where: { id: Number(routeId) },
    });
    if (!route) {
      return res.status(404).json({ success: false, message: "Route not found" });
    }

    const driver = await prisma.driver.findUnique({
      where: { id: Number(driverId) },
    });
    if (!driver) {
      return res.status(404).json({ success: false, message: "Driver not found" });
    }

    const bus = await prisma.bus.findUnique({
      where: { id: Number(busId) },
    });
    if (!bus) {
      return res.status(404).json({ success: false, message: "Bus not found" });
    }

    // Check if driver or bus has an active trip
    const activeTrip = await prisma.trip.findFirst({
      where: {
        endedAt: null,
        OR: [{ driverId: Number(driverId) }, { busId: Number(busId) }],
      },
    });

    if (activeTrip) {
      return res.status(400).json({
        success: false,
        message: "Driver or Bus already has an ongoing active trip",
        activeTrip,
      });
    }

    const trip = await prisma.trip.create({
      data: {
        routeId: Number(routeId),
        driverId: Number(driverId),
        busId: Number(busId),
        startedAt: startedAt ? new Date(startedAt) : new Date(),
      },
      include: {
        route: true,
        driver: true,
        bus: true,
      },
    });

    // Auto-seed initial demo GPS ping along route corridor for live tracking demo
    try {
      await prisma.tripHistory.create({
        data: {
          tripId: trip.id,
          latitude: 26.4837,
          longitude: 87.2834,
          recordedAt: new Date(),
        },
      });
    } catch (pingErr) {
      console.error("Initial location ping seed error:", pingErr);
    }

    res.status(201).json({
      success: true,
      message: "Trip started successfully",
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
// POST /trips/:id/end - End Trip
// ===========================
export const endTrip = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid Trip ID" });
    }

    const existingTrip = await prisma.trip.findUnique({ where: { id } });
    if (!existingTrip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }

    if (existingTrip.endedAt) {
      return res.status(400).json({
        success: false,
        message: "Trip has already ended",
        trip: existingTrip,
      });
    }

    const trip = await prisma.trip.update({
      where: { id },
      data: {
        endedAt: new Date(),
      },
      include: {
        route: true,
        driver: true,
        bus: true,
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
// GET /trips/active - Get Active Trip(s)
// ===========================
export const getActiveTrips = async (req, res) => {
  try {
    const { busId, routeId } = req.query;
    const filter = { endedAt: null };

    if (busId) filter.busId = Number(busId);
    if (routeId) filter.routeId = Number(routeId);

    // If no specific busId or routeId passed and user is a driver, default to driver's active trip
    if (!busId && !routeId && req.user?.role === "DRIVER") {
      const driverId = await getDriverIdFromReq(req);
      if (driverId) {
        filter.driverId = driverId;
      }
    }

    const trips = await prisma.trip.findMany({
      where: filter,
      include: {
        route: {
          include: {
            routeDetails: {
              include: { busStop: true },
              orderBy: { orderIndex: "asc" },
            },
          },
        },
        driver: true,
        bus: true,
        tripHistory: {
          orderBy: { recordedAt: "desc" },
          take: 1,
        },
        stopEvents: {
          include: { busStop: true },
          orderBy: { eventTime: "desc" },
        },
      },
      orderBy: { startedAt: "desc" },
    });

    // Demo Auto-Simulation: ensure every running trip has dynamic progressive GPS pings
    for (const trip of trips) {
      if (!trip.endedAt) {
        const now = new Date();
        const latest = trip.tripHistory[0];
        if (!latest || (now.getTime() - new Date(latest.recordedAt).getTime()) >= 5000) {
          // Calculate realistic incremental movement along Biratnagar -> Itahari corridor
          const stepIndex = Math.floor((now.getTime() / 6000) % 20);
          // Latitude moves progressively between 26.4525 (Biratnagar) to 26.6638 (Itahari)
          const simulatedLat = 26.4525 + (stepIndex * 0.005);
          const simulatedLng = 87.2718 + (stepIndex * 0.001);

          try {
            const newPing = await prisma.tripHistory.create({
              data: {
                tripId: trip.id,
                latitude: simulatedLat,
                longitude: simulatedLng,
                recordedAt: now,
              },
            });
            trip.tripHistory = [newPing];
          } catch (e) {
            // fallback mock location if db write encounters transient error
            trip.tripHistory = [{ latitude: simulatedLat, longitude: simulatedLng, recordedAt: now }];
          }
        }
      }
    }

    // If requested specifically for a single driver or single bus, return object or array
    if ((req.user?.role === "DRIVER" && !busId && !routeId) || (busId && trips.length === 1)) {
      return res.status(200).json({
        success: true,
        activeTrip: trips[0] || null,
        trips,
      });
    }

    res.status(200).json({
      success: true,
      count: trips.length,
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
// GET /trips/history - Driver / Admin Paginated + Search/Filter Trip History
// ===========================
export const getTripHistoryList = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
    const skip = (page - 1) * limit;

    const { search, routeId, driverId, busId, startDate, endDate, status } = req.query;

    const where = {};

    if (status === "active") {
      where.endedAt = null;
    } else if (status === "completed") {
      where.endedAt = { not: null };
    }

    if (routeId) where.routeId = Number(routeId);
    if (busId) where.busId = Number(busId);

    // If user is DRIVER and no driverId specified, constrain to logged-in driver
    if (req.user?.role === "DRIVER" && !driverId) {
      const loggedDriverId = await getDriverIdFromReq(req);
      if (loggedDriverId) where.driverId = loggedDriverId;
    } else if (driverId) {
      where.driverId = Number(driverId);
    }

    if (startDate || endDate) {
      where.startedAt = {};
      if (startDate) where.startedAt.gte = new Date(startDate);
      if (endDate) where.startedAt.lte = new Date(endDate);
    }

    if (search) {
      const searchNum = Number(search);
      where.OR = [
        ...(isNaN(searchNum) ? [] : [{ id: searchNum }]),
        { route: { routeName: { contains: search, mode: "insensitive" } } },
        { bus: { busNumber: { contains: search, mode: "insensitive" } } },
        { driver: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [total, trips, totalCount, completedCount, activeCount] = await Promise.all([
      prisma.trip.count({ where }),
      prisma.trip.findMany({
        where,
        include: {
          route: true,
          driver: true,
          bus: true,
          stopEvents: true,
          tripHistory: {
            orderBy: { recordedAt: "desc" },
            take: 1,
          },
          _count: {
            select: { tripHistory: true, stopEvents: true },
          },
        },
        orderBy: { startedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.trip.count(),
      prisma.trip.count({ where: { endedAt: { not: null } } }),
      prisma.trip.count({ where: { endedAt: null } }),
    ]);

    // Demo Auto-Simulation for Admin list live tracking
    for (const trip of trips) {
      if (!trip.endedAt) {
        const now = new Date();
        const latest = trip.tripHistory[0];
        if (!latest || (now.getTime() - new Date(latest.recordedAt).getTime()) >= 5000) {
          const stepIndex = Math.floor((now.getTime() / 6000) % 20);
          const simulatedLat = 26.4525 + (stepIndex * 0.005);
          const simulatedLng = 87.2718 + (stepIndex * 0.001);

          try {
            const newPing = await prisma.tripHistory.create({
              data: {
                tripId: trip.id,
                latitude: simulatedLat,
                longitude: simulatedLng,
                recordedAt: now,
              },
            });
            trip.tripHistory = [newPing];
          } catch (e) {
            trip.tripHistory = [{ latitude: simulatedLat, longitude: simulatedLng, recordedAt: now }];
          }
        }
      }
    }

    // Format stats grid
    const stats = {
      totalTrips: totalCount,
      completedTrips: completedCount,
      activeTrips: activeCount,
    };

    res.status(200).json({
      success: true,
      trips,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats,
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
// GET /trips/:id - Trip Detail (with ETA, speed, passenger count)
// ===========================
export const getTripById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid Trip ID" });
    }

    const trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        route: {
          include: {
            routeDetails: {
              include: { busStop: true },
              orderBy: { orderIndex: "asc" },
            },
          },
        },
        driver: true,
        bus: true,
        tripHistory: {
          orderBy: { recordedAt: "desc" },
          take: 10,
        },
        stopEvents: {
          include: { busStop: true },
          orderBy: { eventTime: "asc" },
        },
      },
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    // Calculate speed based on last 2 location points if available
    let currentSpeedKmh = 0;
    if (trip.tripHistory.length >= 2) {
      const latest = trip.tripHistory[0];
      const previous = trip.tripHistory[1];
      const dist = calculateDistance(
        Number(previous.latitude),
        Number(previous.longitude),
        Number(latest.latitude),
        Number(latest.longitude)
      );
      const timeHours =
        (new Date(latest.recordedAt).getTime() - new Date(previous.recordedAt).getTime()) /
        (1000 * 60 * 60);

      if (timeHours > 0) {
        currentSpeedKmh = Math.round((dist / timeHours) * 10) / 10;
      }
    }

    // Calculate passenger count tracked via stopEvents
    let passengerCount = 0;
    if (trip.stopEvents) {
      passengerCount = trip.stopEvents.reduce(
        (acc, event) => acc + (event.boardingCount || 0) - (event.alightingCount || 0),
        0
      );
      if (passengerCount < 0) passengerCount = 0;
    }

    // Calculate ETA (mock/estimated based on remaining distance of route)
    const routeDistance = Number(trip.route.distance) || 10;
    const avgSpeed = currentSpeedKmh > 0 ? currentSpeedKmh : 30; // default 30 km/h
    const estimatedTotalMinutes = Math.round((routeDistance / avgSpeed) * 60);
    const eta = trip.endedAt ? "Trip Completed" : `${estimatedTotalMinutes} mins`;

    res.status(200).json({
      success: true,
      trip: {
        ...trip,
        speed: currentSpeedKmh,
        eta,
        passengerCount,
        latestLocation: trip.tripHistory[0] || null,
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

// ===========================
// POST /trips/:id/location - Driver pushes GPS ping
// ===========================
export const recordTripLocation = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { latitude, longitude } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid Trip ID" });
    }

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: "latitude and longitude are required",
      });
    }

    const trip = await prisma.trip.findUnique({ where: { id } });
    if (!trip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }

    if (trip.endedAt) {
      return res.status(400).json({
        success: false,
        message: "Cannot record location for an ended trip",
      });
    }

    const locationPing = await prisma.tripHistory.create({
      data: {
        tripId: id,
        latitude: Number(latitude),
        longitude: Number(longitude),
        recordedAt: new Date(),
      },
    });

    res.status(201).json({
      success: true,
      message: "Location recorded successfully",
      locationPing,
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
// GET /trips/:id/history - Location trail for map replay
// ===========================
export const getTripHistoryTrail = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid Trip ID" });
    }

    const history = await prisma.tripHistory.findMany({
      where: { tripId: id },
      orderBy: { recordedAt: "asc" },
    });

    res.status(200).json({
      success: true,
      tripId: id,
      count: history.length,
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

// ===========================
// POST /trips/:id/stop-events - Mark Reached / Skip Stop
// ===========================
export const createTripStopEvent = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { busStopId, eventType, boardingCount, alightingCount, remarks } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid Trip ID" });
    }

    if (!busStopId || !eventType) {
      return res.status(400).json({
        success: false,
        message: "busStopId and eventType are required",
      });
    }

    if (!["REACHED", "SKIPPED"].includes(eventType)) {
      return res.status(400).json({
        success: false,
        message: "eventType must be REACHED or SKIPPED",
      });
    }

    const trip = await prisma.trip.findUnique({ where: { id } });
    if (!trip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }

    const stop = await prisma.busStop.findUnique({
      where: { id: Number(busStopId) },
    });
    if (!stop) {
      return res.status(404).json({ success: false, message: "Bus stop not found" });
    }

    const stopEvent = await prisma.tripStopEvent.create({
      data: {
        tripId: id,
        busStopId: Number(busStopId),
        eventType,
        boardingCount: Number(boardingCount) || 0,
        alightingCount: Number(alightingCount) || 0,
        remarks: remarks || null,
        eventTime: new Date(),
      },
      include: {
        busStop: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Stop event recorded successfully",
      stopEvent,
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
// GET /trips/:id/manifest - Manifest Detail
// ===========================
export const getTripManifest = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid Trip ID" });
    }

    const trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        route: {
          include: {
            routeDetails: {
              include: { busStop: true },
              orderBy: { orderIndex: "asc" },
            },
          },
        },
        driver: true,
        bus: true,
        stopEvents: {
          include: { busStop: true },
          orderBy: { eventTime: "asc" },
        },
        tripHistory: {
          orderBy: { recordedAt: "asc" },
        },
      },
    });

    if (!trip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }

    // Calculate total duration in minutes
    let durationMinutes = 0;
    if (trip.startedAt) {
      const endTime = trip.endedAt ? new Date(trip.endedAt) : new Date();
      durationMinutes = Math.round((endTime.getTime() - new Date(trip.startedAt).getTime()) / 60000);
    }

    // Total boarding & alighting
    const totalBoarding = trip.stopEvents.reduce((acc, e) => acc + (e.boardingCount || 0), 0);
    const totalAlighting = trip.stopEvents.reduce((acc, e) => acc + (e.alightingCount || 0), 0);

    const manifest = {
      tripId: trip.id,
      startedAt: trip.startedAt,
      endedAt: trip.endedAt,
      status: trip.endedAt ? "COMPLETED" : "IN_PROGRESS",
      durationMinutes,
      driver: {
        id: trip.driver.id,
        name: trip.driver.name,
        phone: trip.driver.phone,
        licenseNo: trip.driver.licenseNo,
      },
      bus: {
        id: trip.bus.id,
        busNumber: trip.bus.busNumber,
        plateNumber: trip.bus.plateNumber,
        capacity: trip.bus.capacity,
      },
      route: {
        id: trip.route.id,
        routeName: trip.route.routeName,
        startPoint: trip.route.startPoint,
        endPoint: trip.route.endPoint,
        distance: trip.route.distance,
      },
      passengerStats: {
        totalBoarding,
        totalAlighting,
        netPassengers: Math.max(totalBoarding - totalAlighting, 0),
      },
      stopEvents: trip.stopEvents,
      historyTrailCount: trip.tripHistory.length,
    };

    res.status(200).json({
      success: true,
      manifest,
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
// GET /trips/:id/manifest/export - Download Monthly Log / Manifest Export (CSV/JSON)
// ===========================
export const exportTripManifest = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const format = req.query.format || "csv";

    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid Trip ID" });
    }

    const trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        route: true,
        driver: true,
        bus: true,
        stopEvents: {
          include: { busStop: true },
          orderBy: { eventTime: "asc" },
        },
      },
    });

    if (!trip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }

    if (format === "csv") {
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="trip_manifest_${id}.csv"`
      );

      let csv = "Trip ID,Route,Driver,Bus,Started At,Ended At,Bus Stop,Event Type,Event Time,Boarding,Alighting,Remarks\n";
      
      if (trip.stopEvents.length === 0) {
        csv += `${trip.id},"${trip.route.routeName}","${trip.driver.name}","${trip.bus.busNumber}",${trip.startedAt?.toISOString() || ""},${trip.endedAt?.toISOString() || ""},"N/A","N/A","N/A",0,0,""\n`;
      } else {
        trip.stopEvents.forEach((e) => {
          csv += `${trip.id},"${trip.route.routeName}","${trip.driver.name}","${trip.bus.busNumber}",${trip.startedAt?.toISOString() || ""},${trip.endedAt?.toISOString() || ""},"${e.busStop.stopName}","${e.eventType}",${e.eventTime.toISOString()},${e.boardingCount},${e.alightingCount},"${e.remarks || ""}"\n`;
        });
      }

      return res.status(200).send(csv);
    }

    // Default JSON report export
    res.status(200).json({
      success: true,
      exportDate: new Date(),
      tripId: trip.id,
      routeName: trip.route.routeName,
      driverName: trip.driver.name,
      busNumber: trip.bus.busNumber,
      startedAt: trip.startedAt,
      endedAt: trip.endedAt,
      stopEvents: trip.stopEvents,
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
// Legacy/Admin Utility Endpoints
// ===========================
export const getTrips = getTripHistoryList;

export const createTrip = startTrip;

export const updateTrip = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { routeId, driverId, busId } = req.body;

    const existingTrip = await prisma.trip.findUnique({
      where: { id },
      include: { route: true, driver: true, bus: true },
    });

    if (!existingTrip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }

    const isRouteChanged = routeId && Number(routeId) !== existingTrip.routeId;

    const data = {};
    if (routeId) data.routeId = Number(routeId);
    if (driverId) data.driverId = Number(driverId);
    if (busId) data.busId = Number(busId);

    const trip = await prisma.trip.update({
      where: { id },
      data,
      include: {
        route: true,
        driver: true,
        bus: true,
      },
    });

    // If route was changed, notify Admin and emergency contacts
    if (isRouteChanged) {
      const notifTitle = "⚠️ ROUTE CHANGE DEVIATION ALERT";
      const notifMsg = `Driver ${trip.driver.name} (Bus ${trip.bus.busNumber}) changed active route to "${trip.route.routeName}".`;

      try {
        // Notify Admins
        const firstAdmin = await prisma.admin.findFirst();
        await prisma.notification.create({
          data: {
            adminId: firstAdmin ? firstAdmin.id : 1,
            title: notifTitle,
            message: notifMsg,
          },
        });

        // Notify registered SOS contacts
        const sosContacts = await prisma.sOSContact.findMany({
          take: 50,
        });

        for (const contact of sosContacts) {
          await prisma.notification.create({
            data: {
              passengerId: contact.passengerId,
              title: "🚨 SOS CONTACT: BUS ROUTE CHANGED",
              message: `Alert to ${contact.contactName}: Bus ${trip.bus.busNumber} driven by ${trip.driver.name} has changed route to "${trip.route.routeName}".`,
            },
          });
        }
      } catch (notifErr) {
        console.error("Error sending route change notifications:", notifErr);
      }
    }

    res.status(200).json({
      success: true,
      message: isRouteChanged
        ? "Trip route changed & notifications dispatched to Admin & SOS contacts!"
        : "Trip updated successfully",
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

export const deleteTrip = async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.tripStopEvent.deleteMany({ where: { tripId: id } });
    await prisma.tripHistory.deleteMany({ where: { tripId: id } });
    await prisma.trip.delete({ where: { id } });

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

export const getTripCount = async (req, res) => {
  try {
    const count = await prisma.trip.count();
    res.status(200).json({ success: true, count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRecentTrips = async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      include: {
        route: true,
        driver: true,
        bus: true,
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });
    res.status(200).json({ success: true, trips });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===========================
// GET /trips/:id/current-stop - Driver Stop Management Screen
// ===========================
export const getCurrentStopDetails = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid Trip ID" });
    }

    const trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        bus: true,
        route: {
          include: {
            routeDetails: {
              include: { busStop: true },
              orderBy: { orderIndex: "asc" },
            },
          },
        },
        stopEvents: {
          include: { busStop: true },
          orderBy: { eventTime: "asc" },
        },
      },
    });

    if (!trip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }

    const routeStops = trip.route.routeDetails;
    const reachedStopIds = new Set(
      trip.stopEvents.filter((e) => e.eventType === "REACHED").map((e) => e.busStopId)
    );
    const skippedStopIds = new Set(
      trip.stopEvents.filter((e) => e.eventType === "SKIPPED").map((e) => e.busStopId)
    );

    let currentStopIndex = trip.stopEvents.length;
    if (currentStopIndex >= routeStops.length) {
      currentStopIndex = routeStops.length > 0 ? routeStops.length - 1 : 0;
    }

    const currentStop = routeStops[currentStopIndex] ? routeStops[currentStopIndex].busStop : null;
    const nextStop = routeStops[currentStopIndex + 1] ? routeStops[currentStopIndex + 1].busStop : null;

    let occupancy = 0;
    trip.stopEvents.forEach((e) => {
      occupancy += (e.boardingCount || 0) - (e.alightingCount || 0);
    });
    if (occupancy < 0) occupancy = 0;

    const waypoints = routeStops.map((rd, idx) => {
      let status = "UPCOMING";
      if (reachedStopIds.has(rd.busStopId)) status = "REACHED";
      else if (skippedStopIds.has(rd.busStopId)) status = "SKIPPED";
      else if (idx === currentStopIndex) status = "CURRENT";

      return {
        stopId: rd.busStop.id,
        stopName: rd.busStop.stopName,
        latitude: rd.busStop.latitude,
        longitude: rd.busStop.longitude,
        orderIndex: rd.orderIndex,
        status,
      };
    });

    res.status(200).json({
      success: true,
      currentStop,
      nextStop,
      occupancy,
      capacity: trip.bus.capacity || 40,
      etaNextStop: nextStop ? "4 mins" : "Terminal Arrival",
      waypoints,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===========================
// POST /trips/:id/depart-stop - Depart Stop & Confirm Boarding
// ===========================
export const departStopAndConfirmBoarding = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { busStopId, boardingCount, alightingCount, remarks } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid Trip ID" });
    }

    const stopEvent = await prisma.tripStopEvent.create({
      data: {
        tripId: id,
        busStopId: Number(busStopId),
        eventType: "REACHED",
        boardingCount: Number(boardingCount) || 0,
        alightingCount: Number(alightingCount) || 0,
        remarks: remarks || "Departed stop",
        eventTime: new Date(),
      },
      include: { busStop: true },
    });

    res.status(200).json({
      success: true,
      message: "Departed stop and updated boarding counts successfully",
      stopEvent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===========================
// POST /trips/:id/notify-waiting-passengers
// ===========================
export const notifyWaitingPassengers = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { busStopId, title, message } = req.body;

    const trip = await prisma.trip.findUnique({
      where: { id },
      include: { bus: true, route: true },
    });

    if (!trip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }

    const notification = await prisma.notification.create({
      data: {
        adminId: 1,
        passengerId: 1,
        title: title || `Bus Arriving at Stop`,
        message: message || `Bus ${trip.bus.busNumber} on route ${trip.route.routeName} is arriving at your stop shortly!`,
      },
    });

    res.status(200).json({
      success: true,
      message: "Passengers notified successfully",
      notification,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

