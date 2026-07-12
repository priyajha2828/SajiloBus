const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const admin = require("../config/firebase");

const prisma = new PrismaClient();

/* ==========================
   REGISTER ADMIN
========================== */

const registerAdmin = async (req, res) => {
  try {

    const { idToken, phone } = req.body;

    const decodedToken =
      await admin.auth().verifyIdToken(idToken);

    const { uid, email, name } = decodedToken;

    const existingAdmin =
      await prisma.admin.findUnique({
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

    const adminUser =
      await prisma.admin.create({
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

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Registration failed",
    });

  }
};

/* ==========================
   LOGIN ADMIN
========================== */

const loginAdmin = async (req, res) => {

  try {

    const { idToken } = req.body;

    const decodedToken =
      await admin.auth().verifyIdToken(idToken);

    const adminUser =
      await prisma.admin.findUnique({
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

    res.json({

      success: true,
      token,

      admin: {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
      },

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,
      message: "Login failed",

    });

  }

};

module.exports = {

  registerAdmin,
  loginAdmin,

};