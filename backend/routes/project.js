// This file sets up the API route for creating a new project

import express from "express";
import authMiddleware from "../middleware/auth-middleware.js";
import { validateRequest } from "zod-express-middleware";
import { projectSchema } from "../libs/validate-schema.js";
import { createProject } from "../controllers/project.js";
import { z } from "zod";

// Create a new router for project-related routes
const router = express.Router();

// Set up the POST route for creating a project in a workspace
// It checks authentication, validates the request, and then calls createProject
router.post(
  "/:workspaceId/create-project",
  authMiddleware,
  validateRequest({
    params: z.object({ workspaceId: z.string() }),
    body: projectSchema,
  }),
  createProject
);

export default router;
