import "dotenv/config";

import express from "express";
import cors from "cors";

// Routes
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import passengerRoutes from "./routes/passengerRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";
import driverProfileRoutes from "./routes/driverProfileRoutes.js";
import busRoutes from "./routes/busRoutes.js";
import routeRoutes from "./routes/routeRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import busAssignmentRoutes from "./routes/busAssignmentRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import busStopRoutes from "./routes/busStopRoutes.js";
import routeDetailRoutes from "./routes/routeDetailRoutes.js";
import trackingRoutes from "./routes/trackingRoutes.js";
import sosRoutes, { sosContactRouter } from "./routes/sosRoutes.js";
import loginLogRoutes from "./routes/loginLogRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/passengers", passengerRoutes);
app.use("/drivers", driverRoutes);
app.use("/driver-profile", driverProfileRoutes);
app.use("/buses", busRoutes);
app.use("/routes", routeRoutes);
app.use("/notifications", notificationRoutes);
app.use("/assignments", busAssignmentRoutes);
app.use("/bus-assignments", busAssignmentRoutes);
app.use("/trips", tripRoutes);
app.use("/schedules", scheduleRoutes);
app.use("/stops", busStopRoutes);
app.use("/bus-stops", busStopRoutes);
app.use("/route-details", routeDetailRoutes);
app.use("/tracking", trackingRoutes);
app.use("/sos", sosRoutes);
app.use("/sos-contacts", sosContactRouter);
app.use("/login-logs", loginLogRoutes);

// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SajiloBus Backend Running 🚍",
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
