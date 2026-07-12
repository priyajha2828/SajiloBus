const express = require("express");

const router = express.Router();

const {
  getRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
} = require("../controllers/routeController");

router.get("/", getRoutes);

router.get("/:id", getRouteById);

router.post("/", createRoute);

router.put("/:id", updateRoute);

router.delete("/:id", deleteRoute);



module.exports = router;