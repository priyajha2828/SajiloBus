const prisma = require("../config/prisma");

// ===========================
// Get All Drivers
// ===========================

const getDrivers = async (req, res) => {
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

const getDriverById = async (req, res) => {
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

const createDriver = async (req, res) => {
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

    res.status(201).json({
      success: true,
      message: "Driver Added Successfully",
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
// Update Driver
// ===========================

const updateDriver = async (req, res) => {
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

// ===========================
// Delete Driver
// ===========================

const deleteDriver = async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.driver.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Driver Deleted Successfully",
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
// Driver Count
// ===========================

const getDriverCount = async (req, res) => {
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

// ===========================
// Export
// ===========================

module.exports = {
  getDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
  getDriverCount,
};