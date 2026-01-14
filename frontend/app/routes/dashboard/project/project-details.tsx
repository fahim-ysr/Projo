// This page displays detailed information about a single project and its tasks

import { BackButton } from "@/components/back-button";
import { CreateTaskDialog } from "@/components/task/create-task-dialog";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { Progress } from "@/components/ui/progress";
import { UseProjectQuery } from "@/hooks/use-project";
import { getProjectProgress } from "@/lib";
import type { TaskStatus, Project, Task } from "@/types";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";

const ProjectDetails = () => {
  // Gets project ID and workspace ID from the URL
  const { projectId, workspaceId } = useParams<{
    projectId: string;
    workspaceId: string;
  }>();

  const navigate = useNavigate();

  // State to control the "Create Task" modal visibility
  const [isCreateTask, setIsCreateTask] = useState(false);

  // State for filtering tasks by status (To Do, In Progress, Done or All)
  const [taskFilter, setTaskFilter] = useState<TaskStatus | "All">("All");

  // Fetches project details and tasks from the backend
  const { data, isLoading } = UseProjectQuery(projectId!) as {
    data: {
      tasks: Task[];
      project: Project;
    };

    isLoading: boolean;
  };

  // Shows loading spinner while fetching data
  if (isLoading)
    return (
      <div>
        <Loader />
      </div>
    );

  const { project, tasks } = data;

  // Calculates the project completion percentage based on completed tasks
  const projectProgress = getProjectProgress(tasks);

  // Navigates to task details oage when a task is clicked
  const handleTaskClick = (taskId: string) => {
    navigate(
      `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`
    );
  };

  return (
    <div className="space-y-8">
      {/* Project header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {/* Back button to go to previous page */}
          <BackButton />
          <div className="flex items-center gap-3">
            {/* Project title */}
            <h1 className="text-xl md:text-2xl font-bold">{project.title}</h1>
          </div>
          {/* Project description */}
          {project.description && (
            <p className="text-sm text-gray-500">{project.description}</p>
          )}
        </div>

        {/* Project bar and Add Task button */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 min-w-32">
            <div className="text-sm text-muted-foreground">Progress:</div>
            <div className="flex-1">
              <Progress value={projectProgress} className="h-2" />
            </div>
            <span className="text-sm text-muted-foreground">
              {projectProgress}%
            </span>
          </div>

          {/* Button to open Create Task modal */}
          <Button onClick={() => setIsCreateTask(true)}>Add Task</Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        {/* Creates task dialog */}

        <CreateTaskDialog
          open={isCreateTask}
          onOpenChange={setIsCreateTask}
          projectId={projectId!}
          projectMembers={project.members as any}
        />
      </div>
    </div>
  );
};

export default ProjectDetails;
