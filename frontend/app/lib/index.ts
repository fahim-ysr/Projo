// List of public routes that do not require authentication

import type { ProjectStatus, TaskStatus } from "@/types";

export const publicRoutes = [
  "/sign-in",
  "/sign-up",
  "/verify-email",
  "/reset-password",
  "/forgot-password",
  "/",
  "*",
];

// Colors assigned based on the progress of the project
export const getTaskStatusColor = (status: ProjectStatus) => {
  switch (status) {
    case "In Progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    case "Completed":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    case "Cancelled":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    case "On Hold":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    case "Planning":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
  }
};

// Calculates project completion percentage based on completed tasks
export const getProjectProgress = (tasks: { status: TaskStatus }[]) => {
  const totalTasks = tasks.length;

  // Counts how many tasks are marked as 'Done'
  const completedTasks = tasks.filter((task) => task?.status === "Done").length;

  // Calculates percentage (rounded to nearest whole number)
  const progress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return progress;
};
