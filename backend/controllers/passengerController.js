import { prisma } from "../config/prisma.js";
import { getAuth } from "../config/firebase.js";
import jwt from "jsonwebtoken";


export const registerPassenger = async (req, res) => {
  try {
    const { idToken, name, phone } = req.body;

    if (!idToken || !name || !phone) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const decodedToken = await getAuth().verifyIdToken(idToken);

    const firebaseUid = decodedToken.uid;
    const email = decodedToken.email;

    const existingPassenger = await prisma.passenger.findUnique({
      where: {
        firebaseUid,
      },
    });

    if (existingPassenger) {
      return res.status(200).json({
        success: true,
        message: "Passenger already exists",
        passenger: existingPassenger,
      });
    }

    const passenger = await prisma.passenger.create({
      data: {
        firebaseUid,
        email,
        name,
        phone,
      },
    });

    // Notification
    try {
      await prisma.notification.create({
        data: {
          adminId: 1,
          passengerId: passenger.id,
          title: "New Passenger Registered",
          message: `${passenger.name} has registered successfully.`,
        },
      });
    } catch (err) {
      console.log("Notification Error:", err.message);
    }

    res.status(201).json({
      success: true,
      message: "Passenger Registered Successfully",
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

export const loginPassenger = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: "ID Token is required",
      });
    }

    const decodedToken = await getAuth().verifyIdToken(idToken);

    const passenger = await prisma.passenger.findUnique({
      where: {
        firebaseUid: decodedToken.uid,
      },
    });

    if (!passenger) {
      return res.status(404).json({
        success: false,
        message: "Passenger not found",
      });
    }

    const token = jwt.sign(
      {
        id: passenger.id,
        firebaseUid: passenger.firebaseUid,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
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

export const getPassengers = async (req, res) => {
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

export const getPassengerById = async (req, res) => {
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

export const createPassenger = async (req, res) => {
  try {
    const {
      firebaseUid,
      name,
      email,
      phone,
    } = req.body;

    const passenger = await prisma.passenger.create({
      data: {
        firebaseUid,
        name,
        email,
        phone,
      },
    });

    try {
      await prisma.notification.create({
        data: {
          adminId: 1,
          passengerId: passenger.id,
          title: "New Passenger Added",
          message: `${passenger.name} has been added successfully.`,
        },
      });
    } catch (err) {
      console.log("Notification Error:", err.message);
    }

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

export const updatePassenger = async (req, res) => {
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

export const deletePassenger = async (req, res) => {
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

    // Delete Notifications
    await prisma.notification.deleteMany({
      where: {
        passengerId: id,
      },
    });

    // Delete SOS
    await prisma.sOS.deleteMany({
      where: {
        passengerId: id,
      },
    });

    // Delete SOS Contacts
    await prisma.sOSContact.deleteMany({
      where: {
        passengerId: id,
      },
    });

    // Delete Login Logs
    await prisma.passengerLoginLog.deleteMany({
      where: {
        passengerId: id,
      },
    });

    // Delete Passenger
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

export const getPassengerCount = async (req, res) => {
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

