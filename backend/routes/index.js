// Main router that combines all API routes

import express, { Router } from "express";
import authRoutes from "./auth.js";
import workspaceRoutes from "./workspace.js";

const router = express.Router();

// Mount authentication routes
router.use("/auth", authRoutes);
// Mount workspace routes
router.use("/workspaces", workspaceRoutes);

export default router;
