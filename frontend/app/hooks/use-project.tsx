// Custom React hook for creating a new project in a workspace

import type { CreateProjectFormData } from "@/components/project/create-project";
import { fetchData, postData } from "@/lib/fetch-util";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const UseCreateProject = () => {
  // Get the query client to manage cached data
  const queryClient = useQueryClient();
  return useMutation({
    // Set up a mutation for creating a project
    mutationFn: async (data: {
      projectData: CreateProjectFormData;
      workspaceId: string;
      // When called, this function sends the project data to the backend API
    }) => postData(`/projects/${data.workspaceId}/create-project`, data),

    onSuccess: (data: any) => {
      // After a project is created successfully, update the workspace data in the cache
      queryClient.invalidateQueries({
        queryKey: ["workspace", data.workspace],
      });
    },
  });
};

// Hook for fetching a single project's details and tasks
export const UseProjectQuery = (projectId: string) => {
  return useQuery({
    // Unique key to identify this query in the cache
    queryKey: ["project", projectId],
    // Function that fetches project details and tasks from backend
    queryFn: () => fetchData(`/projects/${projectId}/tasks`),
  });
};
