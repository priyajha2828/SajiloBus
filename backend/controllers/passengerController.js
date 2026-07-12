<<<<<<< HEAD
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
=======
import {prisma} from "../config/prisma.js";
import  { app , getAuth } from "../config/firebase.js";
import jwt from "jsonwebtoken";

export const registerPassenger = async (req, res) => {
    try{
        const {idToken, name, phone} = req.body;

        //for validation
        if(!idToken || !name || !phone){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
         // Verify Firebase Token
    const decodedToken = await getAuth().verifyIdToken(idToken);

    const firebaseUid = decodedToken.uid;
    const email = decodedToken.email;

    // Check existing passenger
    const existingPassenger = await prisma.passenger.findUnique({
      where: {
        firebaseUid: firebaseUid,
      },
    });
    console.log("Existing Passenger:", existingPassenger); 

    if (existingPassenger) {
      return res.status(200).json({
        success: true,
        message: "Passenger already exists",
        passenger: existingPassenger,
      });
    }

// Create new passenger
    const newPassenger = await prisma.passenger.create({
      data: {
        firebaseUid: firebaseUid,
        email: email,
        name: name,
        phone: phone,
>>>>>>> 20c3ca8643a1b4b50975f40c9f1c67be8a464915
      },
    });

    res.status(201).json({
      success: true,
<<<<<<< HEAD
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
=======
      message: "Passenger registered successfully",
      passenger: newPassenger,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
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

    // Verify Firebase Token
    const decodedToken = await getAuth().verifyIdToken(idToken);

    const firebaseUid = decodedToken.uid;

    // Check Passenger
    const passenger = await prisma.passenger.findUnique({
      where: {
        firebaseUid,
      },
>>>>>>> 20c3ca8643a1b4b50975f40c9f1c67be8a464915
    });

    if (!passenger) {
      return res.status(404).json({
        success: false,
        message: "Passenger not found",
      });
    }

<<<<<<< HEAD
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
=======
    // Generate JWT
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
    console.error(error);
>>>>>>> 20c3ca8643a1b4b50975f40c9f1c67be8a464915

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

<<<<<<< HEAD
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
=======


// export default {
//     registerPassenger,
//     loginPassenger,
// };
>>>>>>> 20c3ca8643a1b4b50975f40c9f1c67be8a464915
