const prisma = require("../config/prisma");
const { getAuth } = require("../config/firebase");
const jwt = require("jsonwebtoken");

const registerPassenger = async (req, res) => {
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
      },
    });

    res.status(201).json({
      success: true,
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
const loginPassenger = async (req, res) => {
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
    });

    if (!passenger) {
      return res.status(404).json({
        success: false,
        message: "Passenger not found",
      });
    }

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

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



module.exports = {
    registerPassenger,
    loginPassenger,
};