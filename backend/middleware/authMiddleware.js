import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check Authorization header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // Extract Token
    const token = authHeader.split(" ")[1];

    // Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Save logged-in user
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Access denied.",
    });
  }

  next();
};

export const isDriver = (req, res, next) => {
  if (req.user.role !== "DRIVER") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Drivers only.",
    });
  }

  next();
};

export const isDriverOrAdmin = (req, res, next) => {
  if (req.user.role !== "DRIVER" && req.user.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Access denied.",
    });
  }

  next();
};