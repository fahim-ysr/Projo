// This file sets up the API route for creating a new task in a project

import express from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import authMiddleware from "../middleware/auth-middleware";
import { taskSchema } from "../libs/validate-schema.js";
import { createTask } from "../controllers/tasks.js";

// Creates new router for task related routes
const router = express.Router();

// Sets up POST route
router.post(
  "/:projectId/create-task",
  authMiddleware,
  //   Validates the projectId is a string
  validateRequest({
    params: z.object({
      projectId: z.string(),
    }),
    // Validates task data
    body: taskSchema,
  }),
  //   Creates the task
  createTask
);

export default router;
