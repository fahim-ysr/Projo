import { z } from "zod";

export const signInSchema = z.object({
  // Gets email and password
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password is required"),
});

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

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});
