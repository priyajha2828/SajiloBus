import express from "express";
import {loginAdmin} from "../controllers/adminController.js";

export const router = express.Router();

router.post("/login", loginAdmin);
