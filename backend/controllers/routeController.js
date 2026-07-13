import { prisma } from "../config/prisma.js";

// Get All Routes
export const getRoutes = async (req, res) => {
  try {
    const routes = await prisma.route.findMany({
      orderBy: {
        id: "desc",
      },
    });

    res.json({
      success: true,
      routes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Route By Id
export const getRouteById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const route = await prisma.route.findUnique({
      where: { id },
    });

    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found",
      });
    }

    res.json({
      success: true,
      route,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create Route
export const createRoute = async (req, res) => {
  try {
    const {
      routeName,
      startPoint,
      endPoint,
      distance,
    } = req.body;

    // Create Route
    const route = await prisma.route.create({
      data: {
        routeName,
        startPoint,
        endPoint,
        distance: Number(distance),
      },
    });

    // Create Notification
    await prisma.notification.create({
      data: {
        adminId: 1,
        passengerId: 1,
        title: "New Route Added",
        message: `${route.routeName} has been added successfully.`,
      },
    });

    res.status(201).json({
      success: true,
      message: "Route Added Successfully",
      route,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Route
export const updateRoute = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const {
      routeName,
      startPoint,
      endPoint,
      distance,
    } = req.body;

    const route = await prisma.route.update({
      where: { id },
      data: {
        routeName,
        startPoint,
        endPoint,
        distance,
      },
    });

    res.json({
      success: true,
      message: "Route Updated Successfully",
      route,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Route
export const deleteRoute = async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Check route exists
    const route = await prisma.route.findUnique({
      where: {
        id,
      },
    });

    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found",
      });
    }

    // Delete Trip History
    await prisma.tripHistory.deleteMany({
      where: {
        trip: {
          routeId: id,
        },
      },
    });

    // Delete Trips
    await prisma.trip.deleteMany({
      where: {
        routeId: id,
      },
    });

    // Delete Route Details
    await prisma.routeDetails.deleteMany({
      where: {
        routeId: id,
      },
    });

    // Delete Bus Schedules
    await prisma.busSchedule.deleteMany({
      where: {
        routeId: id,
      },
    });

    // Delete Route
    await prisma.route.delete({
      where: {
        id,
      },
    });

    res.json({
      success: true,
      message: "Route Deleted Successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

