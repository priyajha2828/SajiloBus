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

// ==============================
// GET /stops — List All Bus Stops
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
      include: {
        _count: {
          select: { routeDetails: true },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: busStops.length,
      busStops,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// GET /stops/nearby?lat=&lng= — Passenger "Nearby Bus Stops"
// ==============================
export const getNearbyBusStops = async (req, res) => {
  try {
    const { lat, lng, radiusKm } = req.query;

    const userLat = Number(lat);
    const userLng = Number(lng);
    const maxRadius = Number(radiusKm) || 5; // Default 5km radius

    const allStops = await prisma.busStop.findMany({
      include: {
        routeDetails: {
          include: { route: true },
        },
      },
    });

    let nearbyStops = allStops.map((stop) => {
      const stopLat = Number(stop.latitude);
      const stopLng = Number(stop.longitude);
      let distanceKm = null;

      if (!isNaN(userLat) && !isNaN(userLng)) {
        distanceKm = Math.round(calculateDistance(userLat, userLng, stopLat, stopLng) * 100) / 100;
      }

      return {
        id: stop.id,
        stopName: stop.stopName,
        latitude: stopLat,
        longitude: stopLng,
        distanceKm,
        routes: stop.routeDetails.map((rd) => ({
          routeId: rd.route.id,
          routeName: rd.route.routeName,
        })),
      };
    });

    if (!isNaN(userLat) && !isNaN(userLng)) {
      nearbyStops = nearbyStops
        .filter((s) => s.distanceKm !== null && s.distanceKm <= maxRadius)
        .sort((a, b) => a.distanceKm - b.distanceKm);
    }

    res.status(200).json({
      success: true,
      count: nearbyStops.length,
      stops: nearbyStops,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// GET /stops/:id — Get Bus Stop By ID
// ==============================
export const getBusStopById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid Stop ID" });
    }

    const busStop = await prisma.busStop.findUnique({
      where: { id },
      include: {
        routeDetails: {
          include: { route: true },
          orderBy: { orderIndex: "asc" },
        },
      },
    });

    if (!busStop) {
      return res.status(404).json({
        success: false,
        message: "Bus Stop not found",
      });
    }

    res.status(200).json({
      success: true,
      busStop,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// POST /stops — Create Bus Stop (Admin)
// ==============================
export const createBusStop = async (req, res) => {
  try {
    const { stopName, latitude, longitude } = req.body;

    if (!stopName || latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: "stopName, latitude, and longitude are required",
      });
    }

    const existing = await prisma.busStop.findFirst({
      where: { stopName },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Bus Stop with this name already exists",
      });
    }

    const busStop = await prisma.busStop.create({
      data: {
        stopName,
        latitude: Number(latitude),
        longitude: Number(longitude),
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
      message: error.message,
    });
  }
};

// ==============================
// PATCH / PUT /stops/:id — Update Bus Stop (Admin)
// ==============================
export const updateBusStop = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid Stop ID" });
    }

    const { stopName, latitude, longitude } = req.body;

    const data = {};
    if (stopName !== undefined) data.stopName = stopName;
    if (latitude !== undefined) data.latitude = Number(latitude);
    if (longitude !== undefined) data.longitude = Number(longitude);

    const busStop = await prisma.busStop.update({
      where: { id },
      data,
    });

    res.status(200).json({
      success: true,
      message: "Bus Stop updated successfully",
      busStop,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// DELETE /stops/:id — Delete Bus Stop (Admin)
// ==============================
export const deleteBusStop = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid Stop ID" });
    }

    const existing = await prisma.busStop.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Bus Stop not found",
      });
    }

    // Delete relationships
    await prisma.routeDetails.deleteMany({ where: { busStopId: id } });
    await prisma.tripStopEvent.deleteMany({ where: { busStopId: id } });
    await prisma.busStop.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: "Bus Stop deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Bus Stop Count
// ==============================
export const getBusStopCount = async (req, res) => {
  try {
    const count = await prisma.busStop.count();
    res.status(200).json({ success: true, count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};