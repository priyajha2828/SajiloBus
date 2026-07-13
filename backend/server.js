import "dotenv/config";

import express from "express";
import cors from "cors";

<<<<<<< HEAD
// Routes
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";
import busRoutes from "./routes/busRoutes.js";
import routeRoutes from "./routes/routeRoutes.js";
import passengerRoutes from "./routes/passengerRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import busAssignmentRoutes from "./routes/busAssignmentRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
=======
import {router as adminRoutes} from "./routes/adminRoutes.js";
import  {router as passengerRoutes} from "./routes/passengerRoutes.js";
import  {router as driverRoutes} from "./routes/driverRoutes.js";
import {router as busRoutes} from "./routes/busRoutes.js";
>>>>>>> 6b440c43b355ae0215ef1a8d276cfea7c92e0780

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

<<<<<<< HEAD
// API Routes
app.use("/admin", adminAuthRoutes);
=======
// Routes
app.use("/admin", adminRoutes);
app.use("/passengers", passengerRoutes);
>>>>>>> 6b440c43b355ae0215ef1a8d276cfea7c92e0780
app.use("/drivers", driverRoutes);
app.use("/buses", busRoutes);
app.use("/routes", routeRoutes);
app.use("/passengers", passengerRoutes);
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