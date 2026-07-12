import {prisma} from "../config/prisma.js";

// ===========================
// Get All Drivers
// ===========================

export const getDrivers = async (req, res) => {
  try {
    const drivers = await prisma.driver.findMany({
      orderBy: {
        id: "desc",
      },
    });

    res.status(200).json({
      success: true,
      drivers,
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
// Get Driver By ID
// ===========================

export const getDriverById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const driver = await prisma.driver.findUnique({
      where: {
        id,
      },
    });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    res.status(200).json({
      success: true,
      driver,
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
// Create Driver
// ===========================

export const createDriver = async (req, res) => {
  try {
    const {
      firebaseUid,
      name,
      email,
      phone,
      licenseNo,
      isAvailable,
    } = req.body;

    const driver = await prisma.driver.create({
      data: {
        firebaseUid,
        name,
        email,
        phone,
        licenseNo,
        isAvailable,
      },
    });

  try {
  const notification = await prisma.notification.create({
    data: {
      adminId: 1,
      passengerId: 1,
      title: "New Driver Added",
      message: `${name} has been added successfully.`,
    },
  });

  console.log("Notification created:", notification);

} catch (err) {
  console.error("Notification Error:", err);
}

    res.status(201).json({
      success: true,
      message: "Driver Added Successfully",
      driver,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===========================
// Update Driver
// ===========================

export const updateDriver = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const {
      name,
      email,
      phone,
      licenseNo,
      isAvailable,
    } = req.body;

    const driver = await prisma.driver.update({
      where: {
        id,
      },
      data: {
        name,
        email,
        phone,
        licenseNo,
        isAvailable,
      },
    });


    res.status(200).json({
      success: true,
      message: "Driver Updated Successfully",
      driver,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const deleteDriver = async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Check driver exists
    const driver = await prisma.driver.findUnique({
      where: { id },
    });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    // Delete login logs
    await prisma.driverLoginLog.deleteMany({
      where: {
        driverId: id,
      },
    });

    // Delete bus assignments
    await prisma.busAssignment.deleteMany({
      where: {
        driverId: id,
      },
    });

    // Delete trip history FIRST
    await prisma.tripHistory.deleteMany({
      where: {
        trip: {
          driverId: id,
        },
      },
    });

    // Delete trips
    await prisma.trip.deleteMany({
      where: {
        driverId: id,
      },
    });

    // Delete driver
    await prisma.driver.delete({
      where: {
        id,
      },
    });

    res.json({
      success: true,
      message: "Driver Deleted Successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===========================
// Driver Count
// ===========================
export const getDriverCount = async (req, res) => {
  try {
    const count = await prisma.driver.count();

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

const getDriverStatus = async (req, res) => {
  try {
    const drivers = await prisma.driver.findMany({
      include: {
        trips: {
          where: {
            endedAt: null,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    const driverStatus = drivers.map((driver) => {
      let status = "Offline";

      if (driver.trips.length > 0) {
        status = "Driving";
      } else if (driver.isAvailable) {
        status = "Available";
      }

      return {
        id: driver.id,
        name: driver.name,
        status,
      };
    });

    res.json({
      success: true,
      drivers: driverStatus,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch driver status.",
    });
  }
};


// ===========================
// Export
// ===========================

<<<<<<< HEAD
module.exports = {
  getDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
  getDriverCount,
  getDriverStatus,
};
=======
// export default {
//   getDrivers,
//   getDriverById,
//   createDriver,
//   updateDriver,
//   deleteDriver,
//   getDriverCount,
// };
>>>>>>> 20c3ca8643a1b4b50975f40c9f1c67be8a464915
