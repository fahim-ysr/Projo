import express from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import { registerSchema, loginSchema } from "../libs/validate-schema.js";
import { registerUser, loginUser } from "../controllers/auth-controller.js";

// Creates a new router instance for authentication routes
const router = express.Router();

// Registers a new user account
router.post(
  "/register",
  validateRequest({
    body: registerSchema,
  }),
  registerUser
);

// Logs in an existing user
router.post(
  "/login",
  validateRequest({
    body: loginSchema,
  }),
  loginUser
);

export default router;
