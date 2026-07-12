import "dotenv/config";

import express from "express";
import cors from "cors";

import  {router as passengerRoutes} from "./routes/passengerRoutes.js";
import  {router as driverRoutes} from "./routes/driverRoutes.js";
import {router as busRoutes} from "./routes/busRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/passengers", passengerRoutes);
app.use("/drivers", driverRoutes);
app.use("/buses", busRoutes);

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