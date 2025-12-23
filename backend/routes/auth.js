// Defines authentication related API routes

import express from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resetPasswordSchema,
  emailSchema,
} from "../libs/validate-schema.js";
import {
  registerUser,
  loginUser,
  verifyEmail,
  resetPasswordRequest,
} from "../controllers/auth-controller.js";

// Creates a new router instance for authentication endpoints
const router = express.Router();

// Route for registering a new user
router.post(
  "/register",
  validateRequest({
    body: registerSchema,
  }),
  registerUser
);

// Route for logging in an existing user
router.post(
  "/login",
  validateRequest({
    body: loginSchema,
  }),
  loginUser
);

// Route for verifying a user's email
router.post(
  "/verify-email",
  validateRequest({
    body: verifyEmailSchema,
  }),
  verifyEmail
);

// Route for requesting a password reset
router.post(
  "/reset-password-request",
  validateRequest({ body: emailSchema }),
  resetPasswordRequest
);

// Route for resetting password reset
router.post(
  "/reset-password",
  validateRequest({ body: resetPasswordSchema }),
  verifyResetPasswordTokenAndResetPassword
);

export default router;
