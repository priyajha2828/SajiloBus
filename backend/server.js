require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const adminAuthRoutes =
require("./routes/adminAuthRoutes");
const driverRoutes = require("./routes/driverRoutes");
const busRoutes = require("./routes/busRoutes");
const routeRoutes = require("./routes/routeRoutes");
const passengerRoutes = require("./routes/passengerRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const busAssignmentRoutes = require("./routes/busAssignmentRoutes");
const tripRoutes = require("./routes/tripRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");


const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/admin-auth", adminAuthRoutes); // Admin
app.use("/drivers", driverRoutes);
app.use("/buses", busRoutes);
app.use("/routes", routeRoutes);
app.use("/passengers", passengerRoutes);
app.use("/notifications", notificationRoutes);
app.use("/bus-assignments", busAssignmentRoutes);
app.use("/trips", tripRoutes);
app.use("/schedules", scheduleRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Sajilo Bus Backend Running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0",() => {
  console.log(`Server running on port ${PORT}`);
});