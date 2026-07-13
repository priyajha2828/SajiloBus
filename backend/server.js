import "dotenv/config";

import express from "express";
import cors from "cors";

// Routes
import { router as adminRoutes } from "./routes/adminRoutes.js";
import { router as passengerRoutes } from "./routes/passengerRoutes.js";
import { router as driverRoutes } from "./routes/driverRoutes.js";
import { router as busRoutes } from "./routes/busRoutes.js";
import routeRoutes from "./routes/routeRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import busAssignmentRoutes from "./routes/busAssignmentRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";

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