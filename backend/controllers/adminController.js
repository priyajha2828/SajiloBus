import { prisma } from "../config/prisma.js";
import { getAuth } from "../config/firebase.js";
import  jwt  from "jsonwebtoken";

export const loginAdmin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: "Firebase ID Token is required",
      });
    }

    // Verify Firebase Token
    const decodedToken = await getAuth().verifyIdToken(idToken);
    const firebaseUid = decodedToken.uid;

    // Check Admin
    const existingAdmin = await prisma.admin.findUnique({
      where: {
        firebaseUid,
      },
    });

    if (!existingAdmin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: existingAdmin.id,
        role: "ADMIN",
        firebaseUid: existingAdmin.firebaseUid,
        email: existingAdmin.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      admin: {
        id: existingAdmin.id,
        name: existingAdmin.name,
        email: existingAdmin.email,
        phone: existingAdmin.phone,
        firebaseUid: existingAdmin.firebaseUid,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,                     
      message: error.message,
    });
  }
};