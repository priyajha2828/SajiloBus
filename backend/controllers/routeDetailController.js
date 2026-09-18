import { prisma } from "../config/prisma.js";

/* ===========================
   Get All Route Details
=========================== */
export const getRouteDetails = async (req, res) => {
  try {
    const { routeId } = req.query;

    const where = {};
    if (routeId) where.routeId = Number(routeId);

    const routeDetails = await prisma.routeDetails.findMany({
      where,
      include: {
        route: true,
        busStop: true,
      },
      orderBy: {
        orderIndex: "asc",
      },
    });

    res.status(200).json({
      success: true,
      count: routeDetails.length,
      routeDetails,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================
   Get Route Detail By ID
=========================== */
export const getRouteDetailById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const routeDetail = await prisma.routeDetails.findUnique({
      where: { id },
      include: {
        route: true,
        busStop: true,
      },
    });

    if (!routeDetail) {
      return res.status(404).json({
        success: false,
        message: "Route Detail not found",
      });
    }

    res.status(200).json({
      success: true,
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

/* ===========================
   Create Route Detail
=========================== */
export const createRouteDetail = async (req, res) => {
  try {
    const { routeId, busStopId, orderIndex, remarks } = req.body;

    if (!routeId || !busStopId) {
      return res.status(400).json({
        success: false,
        message: "routeId and busStopId are required",
      });
    }

    const existing = await prisma.routeDetails.findFirst({
      where: {
        routeId: Number(routeId),
        busStopId: Number(busStopId),
      },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "This Bus Stop is already assigned to this Route.",
      });
    }

    const routeDetail = await prisma.routeDetails.create({
      data: {
        routeId: Number(routeId),
        busStopId: Number(busStopId),
        orderIndex: orderIndex !== undefined ? Number(orderIndex) : 1,
        remarks: remarks || null,
      },
      include: {
        busStop: true,
        route: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Route Detail Added Successfully",
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

/* ===========================
   Update Route Detail (PATCH / PUT)
=========================== */
export const updateRouteDetail = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid Route Detail ID" });
    }

    const { routeId, busStopId, orderIndex, remarks } = req.body;

    const existing = await prisma.routeDetails.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Route Detail not found",
      });
    }

    const data = {};
    if (routeId !== undefined) data.routeId = Number(routeId);
    if (busStopId !== undefined) data.busStopId = Number(busStopId);
    if (orderIndex !== undefined) data.orderIndex = Number(orderIndex);
    if (remarks !== undefined) data.remarks = remarks;

    const updated = await prisma.routeDetails.update({
      where: { id },
      data,
      include: {
        busStop: true,
        route: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Route Detail Updated Successfully",
      routeDetail: updated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================
   Delete Route Detail
=========================== */
export const deleteRouteDetail = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid Route Detail ID" });
    }

    const existing = await prisma.routeDetails.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Route Detail not found",
      });
    }

    await prisma.routeDetails.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: "Route Detail Deleted Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================
   Route Detail Count
=========================== */
export const getRouteDetailCount = async (req, res) => {
  try {
    const count = await prisma.routeDetails.count();
    res.status(200).json({ success: true, count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};