// Main Routes Index (Central hub for all API routes)

import express, { Router } from "express";
import authRoutes from "./auth.js";

// Creates main router instance
const router = express.Router();

// Mounts authentication routes
router.use("/auth", authRoutes);

export default router;
