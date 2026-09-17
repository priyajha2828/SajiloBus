import "dotenv/config";

import express from "express";
import cors from "cors";

// Routes
import adminRoutes from "./routes/adminRoutes.js";
import passengerRoutes from "./routes/passengerRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";
import busRoutes from "./routes/busRoutes.js";
import routeRoutes from "./routes/routeRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import busAssignmentRoutes from "./routes/busAssignmentRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import busStopRoutes from "./routes/busStopRoutes.js";
import routeDetailRoutes from "./routes/routeDetailRoutes.js";
import trackingRoutes from "./routes/trackingRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/admin", adminRoutes);
app.use("/passengers", passengerRoutes);
app.use("/drivers", driverRoutes);
app.use("/buses", busRoutes);
app.use("/routes", routeRoutes);
app.use("/notifications", notificationRoutes);
app.use("/bus-assignments", busAssignmentRoutes);
app.use("/trips", tripRoutes);
app.use("/schedules", scheduleRoutes);
app.use("/bus-stops", busStopRoutes);
app.use("/route-details", routeDetailRoutes);
app.use("/tracking", trackingRoutes);

// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SajiloBus Backend Running 🚍",
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
