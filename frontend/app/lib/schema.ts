// Zod schemas for form validation (sign in, sign up, password reset, workspace, project, etc.)

import { ProjectStatus } from "@/types";
import { optional, z } from "zod";

// Schema for sign-in form
export const signInSchema = z.object({
  // Gets email and password
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password is required"),
});

// Schema for sign-up form with password confirmation
export const signUpSchema = z
  .object({
    // Gets name, email, password and confirmPassword
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be 8 characters long"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
  })
  // Checks if password and confirmPassword matches
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

// Schema for resetting password with confirmation
export const resetPasswordSchema = z
  .object({
    // Gets newPassword and confirmPassword
    newPassword: z.string().min(8, "Password must be 8 characters"),
    confirmPassword: z.string().min(8, "Password must be 8 characters"),
  })
  // Checks if password and confirmPassword matches
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

// Schema for forgot password form
export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// Schema for workspace creation form
export const workspaceSchema = z.object({
  name: z.string().min(3, "Must be at least 3 characters"),
  color: z.string().min(3, "Must be at least 3 characters"),
  description: z.string().optional(),
});

// Schema for project creation form
export const projectSchema = z.object({
  title: z.string().min(3, "Must be at least 3 characters"),
  description: z.string().optional(),
  status: z.nativeEnum(ProjectStatus),
  startDate: z.string().min(10, "Start date is required"),
  dueDate: z.string().min(10, "Due date is required"),
  members: z
    .array(
      z.object({
        user: z.string(),
        role: z.enum(["manager", "member", "owner", "viewer"]),
      })
    )
    .optional(),
  tags: z.string().optional(),
});

// Schema for task creation
export const createTaskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  status: z.enum(["To Do", "In Progress", "Done"]),
  priority: z.enum(["Low", "Medium", "High"]),
  dueDate: z.string().min(1, "Due date is required"),
  assignees: z.array(z.string()).min(1, "At least one assignee is required"),
});
