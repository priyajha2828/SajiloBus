const prisma = require("../config/prisma");

// ==========================
// Get All Passengers
// ==========================

const getPassengers = async (req, res) => {
  try {
    const passengers = await prisma.passenger.findMany({
      orderBy: {
        id: "desc",
      },
    });

    res.status(200).json({
      success: true,
      passengers,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Get Passenger By ID
// ==========================

const getPassengerById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const passenger = await prisma.passenger.findUnique({
      where: {
        id,
      },
    });

    if (!passenger) {
      return res.status(404).json({
        success: false,
        message: "Passenger not found",
      });
    }

    res.status(200).json({
      success: true,
      passenger,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Create Passenger
// ==========================

// ==========================
// Create Passenger
// ==========================

const createPassenger = async (req, res) => {
  try {
    const {
      firebaseUid,
      name,
      email,
      phone,
    } = req.body;

    // Create Passenger
    const passenger = await prisma.passenger.create({
      data: {
        firebaseUid,
        name,
        email,
        phone,
      },
    });

    // Create Notification
    await prisma.notification.create({
      data: {
        adminId: 1,
        passengerId: passenger.id,
        title: "New Passenger Registered",
        message: `${passenger.name} has registered successfully.`,
      },
    });

    res.status(201).json({
      success: true,
      message: "Passenger Added Successfully",
      passenger,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Update Passenger
// ==========================

const updatePassenger = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const {
      firebaseUid,
      name,
      email,
      phone,
    } = req.body;

    const passenger = await prisma.passenger.update({
      where: {
        id,
      },
      data: {
        firebaseUid,
        name,
        email,
        phone,
      },
    });

    res.status(200).json({
      success: true,
      message: "Passenger Updated Successfully",
      passenger,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Delete Passenger
// ==========================

const deletePassenger = async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Check passenger exists
    const passenger = await prisma.passenger.findUnique({
      where: { id },
    });

    if (!passenger) {
      return res.status(404).json({
        success: false,
        message: "Passenger not found",
      });
    }

    // Delete related notifications
    await prisma.notification.deleteMany({
      where: {
        passengerId: id,
      },
    });

    // Delete related SOS
    await prisma.sOS.deleteMany({
      where: {
        passengerId: id,
      },
    });

    // Delete related SOS Contacts
    await prisma.sOSContact.deleteMany({
      where: {
        passengerId: id,
      },
    });

    // Delete login logs
    await prisma.passengerLoginLog.deleteMany({
      where: {
        passengerId: id,
      },
    });

    // Finally delete passenger
    await prisma.passenger.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Passenger Deleted Successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Passenger Count
// ==========================

const getPassengerCount = async (req, res) => {
  try {
    const count = await prisma.passenger.count();

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getPassengers,
  getPassengerById,
  createPassenger,
  updatePassenger,
  deletePassenger,
  getPassengerCount,
};