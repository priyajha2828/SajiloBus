import {prisma} from "../utils/prisma.js";
import { app , getAuth } from "../config/firebase.js";
import jwt from "jsonwebtoken";

export const loginAdmin = async (req, res) => {
    try{
        const {idToken} = req.body;

        //for validation
        if(!idToken){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
         // Verify Firebase Token
    const decodedToken = await getAuth().verifyIdToken(idToken);
    const firebaseUid = decodedToken.uid;

    // Check existing admin
    const existingAdmin = await prisma.admin.findUnique({
      where: {
        firebaseUid: firebaseUid,
      },
    });
    if (!existingAdmin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }
    const token = jwt.sign({ id: existingAdmin.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      admin: existingAdmin,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
