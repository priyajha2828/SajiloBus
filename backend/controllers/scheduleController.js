import { prisma } from "../config/prisma.js";

/* =========================================
   GET /schedules - Timetable lookups (routeId, dayOfWeek, busId, search)
========================================= */
export const getSchedules = async (req, res) => {
  try {
    const { routeId, dayOfWeek, busId, search } = req.query;

    const where = {};

    if (routeId) where.routeId = Number(routeId);
    if (busId) where.busId = Number(busId);
    if (dayOfWeek) {
      where.dayOfWeek = {
        equals: dayOfWeek,
        mode: "insensitive",
      };
    }

    if (search) {
      where.OR = [
        { bus: { busNumber: { contains: search, mode: "insensitive" } } },
        { route: { routeName: { contains: search, mode: "insensitive" } } },
        { dayOfWeek: { contains: search, mode: "insensitive" } },
      ];
    }

    const schedules = await prisma.busSchedule.findMany({
      where,
      include: {
        bus: true,
        route: true,
      },
      orderBy: [
        { dayOfWeek: "asc" },
        { departureTime: "asc" },
      ],
    });

    res.status(200).json({
      success: true,
      count: schedules.length,
      schedules,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================
   GET /schedules/:id
========================================= */
export const getScheduleById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid Schedule ID" });
    }

    const schedule = await prisma.busSchedule.findUnique({
      where: { id },
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

    res.status(200).json({
      success: true,
      schedule,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================
   POST /schedules - Admin Create Schedule
========================================= */
export const createSchedule = async (req, res) => {
  try {
    const { busId, routeId, departureTime, dayOfWeek, isActive } = req.body;

    if (!busId || !routeId || !departureTime || !dayOfWeek) {
      return res.status(400).json({
        success: false,
        message: "busId, routeId, departureTime, and dayOfWeek are required",
      });
    }

    const bus = await prisma.bus.findUnique({ where: { id: Number(busId) } });
    if (!bus) {
      return res.status(404).json({ success: false, message: "Bus not found." });
    }

    const route = await prisma.route.findUnique({ where: { id: Number(routeId) } });
    if (!route) {
      return res.status(404).json({ success: false, message: "Route not found." });
    }

    // Parse departureTime
    let depDate = new Date();
    if (typeof departureTime === "string" && departureTime.includes(":")) {
      const [hours, minutes] = departureTime.split(":");
      depDate = new Date(`1970-01-01T${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:00Z`);
    } else {
      depDate = new Date(departureTime);
    }

    const schedule = await prisma.busSchedule.create({
      data: {
        busId: Number(busId),
        routeId: Number(routeId),
        departureTime: depDate,
        dayOfWeek,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
      include: {
        bus: true,
        route: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Schedule added successfully.",
      schedule,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================
   PATCH / PUT /schedules/:id - Admin Update Schedule
========================================= */
export const updateSchedule = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid Schedule ID" });
    }

    const existingSchedule = await prisma.busSchedule.findUnique({ where: { id } });
    if (!existingSchedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found.",
      });
    }

    const { busId, routeId, departureTime, dayOfWeek, isActive } = req.body;

    const data = {};
    if (busId !== undefined) data.busId = Number(busId);
    if (routeId !== undefined) data.routeId = Number(routeId);
    if (dayOfWeek !== undefined) data.dayOfWeek = dayOfWeek;
    if (isActive !== undefined) data.isActive = Boolean(isActive);

    if (departureTime !== undefined) {
      if (typeof departureTime === "string" && departureTime.includes(":")) {
        const [hours, minutes] = departureTime.split(":");
        data.departureTime = new Date(`1970-01-01T${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:00Z`);
      } else {
        data.departureTime = new Date(departureTime);
      }
    }

    const schedule = await prisma.busSchedule.update({
      where: { id },
      data,
      include: {
        bus: true,
        route: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Schedule updated successfully.",
      schedule,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================
   DELETE /schedules/:id - Admin Delete Schedule
========================================= */
export const deleteSchedule = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid Schedule ID" });
    }

    const existingSchedule = await prisma.busSchedule.findUnique({ where: { id } });
    if (!existingSchedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found.",
      });
    }

    await prisma.busSchedule.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: "Schedule deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================
   GET /schedules/count
========================================= */
export const getScheduleCount = async (req, res) => {
  try {
    const count = await prisma.busSchedule.count();
    res.status(200).json({ success: true, count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
