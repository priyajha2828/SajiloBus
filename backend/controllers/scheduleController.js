import { prisma } from "../config/prisma.js";



/* =========================================
   GET ALL SCHEDULES
========================================= */

export const getSchedules = async (req, res) => {
  try {
    const { search } = req.query;

    const schedules = await prisma.busSchedule.findMany({
      where: search
        ? {
            OR: [
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
              {
                dayOfWeek: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {},

      include: {
        bus: true,
        route: true,
      },

      orderBy: {
        id: "desc",
      },
    });

    res.json({
      success: true,
      schedules,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch schedules.",
    });
  }
};

/* =========================================
   GET SCHEDULE BY ID
========================================= */

export const getScheduleById = async (req, res) => {
  try {
    const schedule = await prisma.busSchedule.findUnique({
      where: {
        id: Number(req.params.id),
      },

      include: {
        bus: true,
        route: true,
      },
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found.",
      });
    }

    res.json({
      success: true,
      schedule,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch schedule.",
    });
  }
};

/* =========================================
   CREATE SCHEDULE
========================================= */

export const createSchedule = async (req, res) => {
  try {
    const {
      busId,
      routeId,
      departureTime,
      dayOfWeek,
      isActive,
    } = req.body;

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

    // Duplicate Schedule Check
    const existingSchedule =
      await prisma.busSchedule.findFirst({
        where: {
          busId: Number(busId),
          routeId: Number(routeId),
          departureTime: new Date(
            `1970-01-01T${departureTime}:00`
          ),
          dayOfWeek,
        },
      });

    if (existingSchedule) {
      return res.status(400).json({
        success: false,
        message:
          "Schedule already exists for this bus and route.",
      });
    }

    const schedule =
      await prisma.busSchedule.create({
        data: {
          busId: Number(busId),
          routeId: Number(routeId),
          departureTime: new Date(
            `1970-01-01T${departureTime}:00`
          ),
          dayOfWeek,
          isActive,
        },
      });

    res.status(201).json({
      success: true,
      message: "Schedule added successfully.",
      schedule,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to create schedule.",
    });
  }
};

/* =========================================
   UPDATE SCHEDULE
========================================= */

export const updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      busId,
      routeId,
      departureTime,
      dayOfWeek,
      isActive,
    } = req.body;

    const existingSchedule =
      await prisma.busSchedule.findUnique({
        where: {
          id: Number(id),
        },
      });

    if (!existingSchedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found.",
      });
    }

    const schedule =
      await prisma.busSchedule.update({
        where: {
          id: Number(id),
        },

        data: {
          busId: Number(busId),
          routeId: Number(routeId),
          departureTime: new Date(
            `1970-01-01T${departureTime}:00`
          ),
          dayOfWeek,
          isActive,
        },

        include: {
          bus: true,
          route: true,
        },
      });

    res.json({
      success: true,
      message: "Schedule updated successfully.",
      schedule,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to update schedule.",
    });
  }
};

/* =========================================
   DELETE SCHEDULE
========================================= */

export const deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;

    const existingSchedule = await prisma.busSchedule.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!existingSchedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found.",
      });
    }

    await prisma.busSchedule.delete({
      where: {
        id: Number(id),
      },
    });

    res.json({
      success: true,
      message: "Schedule deleted successfully.",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete schedule.",
    });
  }
};

/* =========================================
   COUNT
========================================= */

export const getScheduleCount = async (req, res) => {
  try {
    const count = await prisma.busSchedule.count();

    res.json({
      success: true,
      count,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to get schedule count.",
    });
  }
};

