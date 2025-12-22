// Layout for authentication pages (sign-in, sign-up, etc.)

import { useAuth } from "@/provider/auth-context";
import React from "react";
import { Navigate, Outlet } from "react-router";

// Renders loading / Redirects authenticated users / Shows auth pages
const AuthLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Shows loading spinner while checking authentication
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Redirects authenticated users to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  // Shows authentication page for unathenticated users
  return <Outlet />;
};

export default AuthLayout;
