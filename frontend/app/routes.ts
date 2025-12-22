// Defines all routes for the application

import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

// Auth related routes
export default [
  layout("routes/auth/auth_layout.tsx", [
    index("routes/root/home.tsx"),
    route("sign-in", "routes/auth/sign-in.tsx"),
    route("sign-up", "routes/auth/sign-up.tsx"),
    route("forgot-password", "routes/auth/forgot-password.tsx"),
    route("reset-password", "routes/auth/reset-password.tsx"),
    route("verify-email", "routes/auth/verify-email.tsx"),
  ]),

  // Dashboard routes
  layout("routes/dashboard/dashboard-layout.tsx", [
    route("dashboard", "routes/dashboard/index.tsx"),
  ]),
] satisfies RouteConfig;
