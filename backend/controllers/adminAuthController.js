import { prisma } from "../config/prisma.js";
import { getAuth } from "../config/firebase.js";
import jwt from "jsonwebtoken";

/* ==========================
   REGISTER ADMIN
========================== */

export const registerAdmin = async (req, res) => {
  try {
    const { idToken, phone } = req.body;

    const decodedToken = await getAuth().verifyIdToken(idToken);

    const { uid, email, name } = decodedToken;

    const existingAdmin = await prisma.admin.findUnique({
      where: {
        firebaseUid: uid,
      },
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    const adminUser = await prisma.admin.create({
      data: {
        firebaseUid: uid,
        email,
        name: name || "Admin",
        phone,
      },
    });

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      admin: adminUser,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================
   LOGIN ADMIN
========================== */

export const loginAdmin = async (req, res) => {
  try {
    const { idToken } = req.body;

    const decodedToken = await getAuth().verifyIdToken(idToken);

    const adminUser = await prisma.admin.findUnique({
      where: {
        firebaseUid: decodedToken.uid,
      },
    });

    if (!adminUser) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const token = jwt.sign(
      {
        id: adminUser.id,
        email: adminUser.email,
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
      admin: adminUser,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};