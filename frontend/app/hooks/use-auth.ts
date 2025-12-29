// Custom React Query hooks for authentication API calls

import type { SignUpFormData } from "@/routes/auth/sign-up";
import { signUpSchema } from "@/lib/schema";
import { useMutation } from "@tanstack/react-query";
import { postData } from "@/lib/fetch-util";

// Hook for registering a new user
export const useSignUpMutation = () => {
  return useMutation({
    mutationFn: (data: SignUpFormData) => postData("/auth/register", data),
  });
};

// Hook for verifying a user's email
export const useVerifyEmailMutation = () => {
  return useMutation({
    mutationFn: (data: { token: string }) =>
      postData("/auth/verify-email", data),
  });
};

// Hook for logging in a user
export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      postData("/auth/login", data),
  });
};

// Hook for forgot password (send reset email)
export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: (data: { email: string }) =>
      postData("/auth/reset-password-request", data),
  });
};

// Hook for resetting password with token
export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: (data: {
      token: string;
      newPassword: string;
      confirmPassword: string;
    }) => postData("/auth/reset-password", data),
  });
};
