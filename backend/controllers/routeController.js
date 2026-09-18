import { prisma } from "../config/prisma.js";

// Haversine distance helper in km
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
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
// GET /routes — List all routes
// ===========================
export const getRoutes = async (req, res) => {
  try {
    const { search } = req.query;

    const where = search
      ? {
          OR: [
            { routeName: { contains: search, mode: "insensitive" } },
            { startPoint: { contains: search, mode: "insensitive" } },
            { endPoint: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const routes = await prisma.route.findMany({
      where,
      include: {
        routeDetails: {
          include: { busStop: true },
          orderBy: { orderIndex: "asc" },
        },
        _count: {
          select: { routeDetails: true, trips: true, schedules: true },
        },
      },
      orderBy: { id: "desc" },
    });

    const formattedRoutes = routes.map((r) => ({
      ...r,
      totalStops: r._count.routeDetails,
      stops: r.routeDetails.map((rd) => ({
        id: rd.busStop.id,
        stopName: rd.busStop.stopName,
        latitude: rd.busStop.latitude,
        longitude: rd.busStop.longitude,
        orderIndex: rd.orderIndex,
        remarks: rd.remarks,
        routeDetailId: rd.id,
      })),
    }));

    res.status(200).json({
      success: true,
      count: formattedRoutes.length,
      routes: formattedRoutes,
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
// GET /routes/search?from=&to= — Passenger Journey Planner / Direct Transit Routes
// ===========================
export const searchRoutes = async (req, res) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message: "Both 'from' and 'to' search parameters are required",
      });
    }

    const fromTerm = from.toLowerCase().trim();
    const toTerm = to.toLowerCase().trim();

    // Fetch all routes with their detailed bus stops
    const allRoutes = await prisma.route.findMany({
      include: {
        routeDetails: {
          include: { busStop: true },
          orderBy: { orderIndex: "asc" },
        },
        schedules: {
          where: { isActive: true },
          include: { bus: true },
        },
        trips: {
          where: { endedAt: null },
          include: { bus: true, driver: true },
        },
      },
    });

    const matchingRoutes = [];

    for (const route of allRoutes) {
      const stopList = route.routeDetails.map((rd, index) => ({
        index,
        orderIndex: rd.orderIndex,
        busStopId: rd.busStop.id,
        stopName: rd.busStop.stopName,
        latitude: Number(rd.busStop.latitude),
        longitude: Number(rd.busStop.longitude),
      }));

      // Find index of 'from' match (matching startPoint or stopName)
      let fromIdx = -1;
      let fromStopName = route.startPoint;

      if (route.startPoint.toLowerCase().includes(fromTerm)) {
        fromIdx = 0;
      } else {
        const found = stopList.find((s) => s.stopName.toLowerCase().includes(fromTerm));
        if (found) {
          fromIdx = found.index;
          fromStopName = found.stopName;
        }
      }

      // Find index of 'to' match (matching endPoint or stopName)
      let toIdx = -1;
      let toStopName = route.endPoint;

      if (route.endPoint.toLowerCase().includes(toTerm)) {
        toIdx = stopList.length > 0 ? stopList.length - 1 : 999;
      } else {
        const found = stopList.find((s) => s.stopName.toLowerCase().includes(toTerm));
        if (found) {
          toIdx = found.index;
          toStopName = found.stopName;
        }
      }

      // Valid direct route if both from & to match and fromIdx < toIdx
      if (fromIdx !== -1 && toIdx !== -1 && fromIdx < toIdx) {
        const stopsInBetween = stopList.slice(fromIdx, toIdx + 1);
        matchingRoutes.push({
          routeId: route.id,
          routeName: route.routeName,
          startPoint: route.startPoint,
          endPoint: route.endPoint,
          distance: route.distance,
          fromMatch: fromStopName,
          toMatch: toStopName,
          stopsCount: stopsInBetween.length,
          intermediateStops: stopsInBetween,
          activeBuses: route.trips.map((t) => ({
            tripId: t.id,
            busNumber: t.bus.busNumber,
            driverName: t.driver.name,
          })),
          schedules: route.schedules,
        });
      }
    }

    res.status(200).json({
      success: true,
      query: { from, to },
      count: matchingRoutes.length,
      routes: matchingRoutes,
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
// GET /routes/:id — Route detail with ordered stops
// ===========================
export const getRouteById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid Route ID" });
    }

    const route = await prisma.route.findUnique({
      where: { id },
      include: {
        routeDetails: {
          include: { busStop: true },
          orderBy: { orderIndex: "asc" },
        },
        schedules: {
          include: { bus: true },
        },
        trips: {
          where: { endedAt: null },
          include: { bus: true, driver: true },
        },
      },
    });

    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found",
      });
    }

    const stops = route.routeDetails.map((rd) => ({
      routeDetailId: rd.id,
      stopId: rd.busStop.id,
      stopName: rd.busStop.stopName,
      latitude: rd.busStop.latitude,
      longitude: rd.busStop.longitude,
      orderIndex: rd.orderIndex,
      remarks: rd.remarks,
    }));

    res.status(200).json({
      success: true,
      route: {
        ...route,
        stops,
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
// POST /routes — Admin Create Route
// ===========================
export const createRoute = async (req, res) => {
  try {
    const { routeName, startPoint, endPoint, distance } = req.body;

    if (!routeName || !startPoint || !endPoint || distance === undefined) {
      return res.status(400).json({
        success: false,
        message: "routeName, startPoint, endPoint, and distance are required",
      });
    }

    const route = await prisma.route.create({
      data: {
        routeName,
        startPoint,
        endPoint,
        distance: Number(distance),
      },
    });

    // Optional Admin Notification
    try {
      await prisma.notification.create({
        data: {
          title: "New Route Added",
          message: `${route.routeName} has been added successfully.`,
        },
      });
    } catch (err) {
      console.log("Notification Error:", err.message);
    }

    res.status(201).json({
      success: true,
      message: "Route Created Successfully",
      route,
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
// PATCH / PUT /routes/:id — Admin Update Route
// ===========================
export const updateRoute = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid Route ID" });
    }

    const { routeName, startPoint, endPoint, distance } = req.body;

    const data = {};
    if (routeName !== undefined) data.routeName = routeName;
    if (startPoint !== undefined) data.startPoint = startPoint;
    if (endPoint !== undefined) data.endPoint = endPoint;
    if (distance !== undefined) data.distance = Number(distance);

    const route = await prisma.route.update({
      where: { id },
      data,
    });

    res.status(200).json({
      success: true,
      message: "Route Updated Successfully",
      route,
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
// DELETE /routes/:id — Admin Delete Route
// ===========================
export const deleteRoute = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid Route ID" });
    }

    const route = await prisma.route.findUnique({ where: { id } });
    if (!route) {
      return res.status(404).json({ success: false, message: "Route not found" });
    }

    // Cascade cleanups
    const trips = await prisma.trip.findMany({ where: { routeId: id }, select: { id: true } });
    const tripIds = trips.map((t) => t.id);
    if (tripIds.length > 0) {
      await prisma.tripStopEvent.deleteMany({ where: { tripId: { in: tripIds } } });
      await prisma.tripHistory.deleteMany({ where: { tripId: { in: tripIds } } });
      await prisma.trip.deleteMany({ where: { routeId: id } });
    }

    await prisma.routeDetails.deleteMany({ where: { routeId: id } });
    await prisma.busSchedule.deleteMany({ where: { routeId: id } });

    await prisma.route.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: "Route Deleted Successfully",
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
// POST /routes/:id/stops — Admin add stop to route
// ===========================
export const addStopToRoute = async (req, res) => {
  try {
    const routeId = Number(req.params.id);
    const { busStopId, orderIndex, remarks } = req.body;

    if (!routeId || isNaN(routeId)) {
      return res.status(400).json({ success: false, message: "Invalid Route ID" });
    }

    if (!busStopId) {
      return res.status(400).json({ success: false, message: "busStopId is required" });
    }

    const route = await prisma.route.findUnique({ where: { id: routeId } });
    if (!route) {
      return res.status(404).json({ success: false, message: "Route not found" });
    }

    const busStop = await prisma.busStop.findUnique({ where: { id: Number(busStopId) } });
    if (!busStop) {
      return res.status(404).json({ success: false, message: "Bus stop not found" });
    }

    // Auto-calculate order index if not provided
    let idx = orderIndex !== undefined ? Number(orderIndex) : null;
    if (idx === null) {
      const lastStop = await prisma.routeDetails.findFirst({
        where: { routeId },
        orderBy: { orderIndex: "desc" },
      });
      idx = lastStop ? lastStop.orderIndex + 1 : 1;
    }

    const routeDetail = await prisma.routeDetails.create({
      data: {
        routeId,
        busStopId: Number(busStopId),
        orderIndex: idx,
        remarks: remarks || null,
      },
      include: {
        busStop: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Stop added to route successfully",
      routeDetail,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
