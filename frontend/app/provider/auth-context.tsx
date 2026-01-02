// Provides authentication state and functions to the entire app

import type { User } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";
import { queryClient } from "./react-query-provider";
import { useLocation, useNavigate } from "react-router";
import { publicRoutes } from "@/lib";

// Defines the shape of authentication context
interface AuthContextType {
  user: User | null; // The currently logged-in user or null if not logged in
  isAuthenticated: boolean; // True if the user is logged in
  isLoading: boolean; // True while checking authentication status
  login: (data: any) => Promise<void>; // Function to log in a user
  logout: () => Promise<void>; // Function to log out a user
}

// Creates the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provides authentication context to child components
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const currentPath = useLocation().pathname;
  const isPublicRoute = publicRoutes.includes(currentPath);

  // Checks if user is already logged in when the app loads
  useEffect(() => {
    const checkAuth = async () => {
      // Debuging (Remove)
      if (typeof window === "undefined") {
        setIsLoading(false);
        return;
      }

      const userInfo = localStorage.getItem("user");

      if (userInfo) {
        setUser(JSON.parse(userInfo));
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);

        // If not logged in and not in a public group, redirects to sign-in
        if (!isPublicRoute) {
          navigate("/sign-in");
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Listens for a "force-logout" event and logs out the user (e.g. Token expired)
  useEffect(() => {
    const handleLogout = () => {
      logout();
      navigate("/sign-in");
    };
    window.addEventListener("force-logout", handleLogout);
    return () => window.removeEventListener("force-logout", handleLogout);
  }, []);

  // Logs in the user -> Saves token and user info -> Updates state
  const login = async (data: any) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setUser(data.user);
    setIsAuthenticated(true);
  };

  // Logs out the user -> Removes the saved token and user info -> Updates state
  const logout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setIsAuthenticated(false);
    queryClient.clear();
  };

  const vals = { user, isAuthenticated, isLoading, login, logout };

  // Makes authentication state and functions available to all children
  return <AuthContext.Provider value={vals}>{children}</AuthContext.Provider>;
};

// Custom hook to use authentication context in components
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
