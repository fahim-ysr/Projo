// Custom React hook for creating tasks in a project

import type { CreateTaskFormData } from "@/components/task/create-task-dialog";
import { postData } from "@/lib/fetch-util";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Hook for creating a new task in a project
export const useCreateTaskMutation = () => {
  // Gets the query client to manage cached data
  const queryClient = useQueryClient();

  return useMutation({
    // Function that sends task data to the backend to create a new task
    mutationFn: (data: { projectId: string; taskData: CreateTaskFormData }) =>
      postData(`/task/${data.projectId}/create-task`, data.taskData),
    // Refreshes the data in cache after successfully creating a task
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: ["project", data.project],
      });
    },
  });
};
