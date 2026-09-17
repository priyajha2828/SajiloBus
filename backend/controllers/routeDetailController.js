import { prisma } from "../config/prisma.js";

/* ===========================
   Get All Route Details
=========================== */
export const getRouteDetails = async (req, res) => {
  try {
    const routeDetails = await prisma.routeDetails.findMany({
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
      routeDetails,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch Route Details",
    });
  }
};

/* ===========================
   Get Route Detail By ID
=========================== */
export const getRouteDetailById = async (req, res) => {
  try {
    const { id } = req.params;

    const routeDetail = await prisma.routeDetails.findUnique({
      where: {
        id: Number(id),
      },
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
      message: "Server Error",
    });
  }
};

/* ===========================
   Create Route Detail
=========================== */
export const createRouteDetail = async (req, res) => {
  try {
    const {
      routeId,
      busStopId,
      orderIndex,
      remarks,
    } = req.body;

    const existing = await prisma.routeDetails.findFirst({
      where: {
        routeId,
        busStopId,
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
        routeId,
        busStopId,
        orderIndex,
        remarks,
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
      message: "Server Error",
    });
  }
};

/* ===========================
   Update Route Detail
=========================== */
export const updateRouteDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      routeId,
      busStopId,
      orderIndex,
      remarks,
    } = req.body;

    const existing = await prisma.routeDetails.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Route Detail not found",
      });
    }

    const updated = await prisma.routeDetails.update({
      where: {
        id: Number(id),
      },
      data: {
        routeId,
        busStopId,
        orderIndex,
        remarks,
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
      message: "Server Error",
    });
  }
};

/* ===========================
   Delete Route Detail
=========================== */
export const deleteRouteDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.routeDetails.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Route Detail not found",
      });
    }

    await prisma.routeDetails.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).json({
      success: true,
      message: "Route Detail Deleted Successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ===========================
   Route Detail Count
=========================== */
export const getRouteDetailCount = async (req, res) => {
  try {
    const count = await prisma.routeDetails.count();

    res.status(200).json({
      success: true,
      count,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};