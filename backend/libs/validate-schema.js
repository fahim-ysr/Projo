// Validation Schema (Defines data validation rules)

import { z } from "zod";

// Schema for validating user's registration data (name, email and password must be present)
const registerSchema = z.object({
  name: z.string().min(3, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

// Schema for validating user's login data (email and password must be present)
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Schema for email verification (Token must be present)
const verifyEmailSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

// Schema for resetting password (Token and password must be present)
const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters long"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
});

// Schema for email
const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// Schema for workspace
const workspaceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  color: z.string().min(1, "Color is required"),
});

export {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resetPasswordSchema,
  emailSchema,
  workspaceSchema,
};
