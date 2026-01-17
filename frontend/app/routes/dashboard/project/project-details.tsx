// This page displays detailed information about a single project and its tasks

import { BackButton } from "@/components/back-button";
import { CreateTaskDialog } from "@/components/task/create-task-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UseProjectQuery } from "@/hooks/use-project";
import { getProjectProgress } from "@/lib";
import { cn } from "@/lib/utils";
import type { TaskStatus, Project, Task } from "@/types";
import { format } from "date-fns";
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
      `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`,
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
        <Tabs defaultValue="all" className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <TabsList>
              <TabsTrigger value="all" onClick={() => setTaskFilter("All")}>
                All Tasks
              </TabsTrigger>
              <TabsTrigger value="todo" onClick={() => setTaskFilter("To Do")}>
                To Do
              </TabsTrigger>
              <TabsTrigger
                value="in-progress"
                onClick={() => setTaskFilter("In Progress")}
              >
                In Progress
              </TabsTrigger>
              <TabsTrigger value="done" onClick={() => setTaskFilter("Done")}>
                Done
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center text-sm">
              <span className="text-muted-foreground">Status:</span>
              <div>
                <Badge variant="outline" className="bg-background">
                  {tasks.filter((task) => task.status === "To Do").length} To Do
                </Badge>
                <Badge variant="outline" className="bg-background">
                  {tasks.filter((task) => task.status === "In Progress").length}{" "}
                  In Progress
                </Badge>
                <Badge variant="outline" className="bg-background">
                  {tasks.filter((task) => task.status === "Done").length} Done
                </Badge>
              </div>
            </div>
          </div>

          <TabsContent value="all" className="m-0">
            <div className="grid grid-cols-3 gap-4">
              <TaskColumn
                title="To Do"
                tasks={tasks.filter((task) => task.status == "To Do")}
                onTaskClick={handleTaskClick}
              />

              <TaskColumn
                title="In Progress"
                tasks={tasks.filter((task) => task.status == "In Progress")}
                onTaskClick={handleTaskClick}
              />

              <TaskColumn
                title="Done"
                tasks={tasks.filter((task) => task.status == "Done")}
                onTaskClick={handleTaskClick}
              />
            </div>
          </TabsContent>

          <TabsContent value="todo" className="m-0">
            <div className="grid grid-cols-3 gap-4">
              <TaskColumn
                title="To Do"
                tasks={tasks.filter((task) => task.status == "To Do")}
                onTaskClick={handleTaskClick}
              />
            </div>
          </TabsContent>

          <TabsContent value="in-progress" className="m-0">
            <div className="grid grid-cols-3 gap-4">
              <TaskColumn
                title="To Do"
                tasks={tasks.filter((task) => task.status == "In Progress")}
                onTaskClick={handleTaskClick}
              />
            </div>
          </TabsContent>

          <TabsContent value="done" className="m-0">
            <div className="grid grid-cols-3 gap-4">
              <TaskColumn
                title="To Do"
                tasks={tasks.filter((task) => task.status == "Done")}
                onTaskClick={handleTaskClick}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Creates task dialog */}

      <CreateTaskDialog
        open={isCreateTask}
        onOpenChange={setIsCreateTask}
        projectId={projectId!}
        projectMembers={project.members as any}
      />
    </div>
  );
};

export default ProjectDetails;

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  isFullWidth?: boolean;
}

const TaskColumn = ({
  title,
  tasks,
  onTaskClick,
  isFullWidth = false,
}: TaskColumnProps) => {
  return (
    <div className={isFullWidth ? "grid grid-cols-1 md:grid-cols-3 gap-4" : ""}>
      <div
        className={cn(
          "space-y-4",
          !isFullWidth ? "h-full" : "col-span-full mb-4",
        )}
      >
        {!isFullWidth && (
          <div>
            <h1 className="font-medium">{title}</h1>
            <Badge variant="outline">{tasks.length}</Badge>
          </div>
        )}

        <div
          className={cn(
            "space-y-3",
            isFullWidth && "grid grid-cols-2 lg:grid-cols-3 gap-4",
          )}
        >
          {tasks.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground">
              No tasks yet
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onClick={() => onTaskClick(task._id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const TaskCard = ({ task, onClick }: { task: Task; onClick: () => void }) => {
  return (
    <Card
      onClick={onClick}
      className="cursor-pointer hover:shadow-md transition-all duration-300 hover:translate-y-1"
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge>{task.priority}</Badge>
        </div>
      </CardHeader>

      <CardContent>
        <h4 className="font-medium mb-2">{task.title}</h4>

        {task.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between text-sm">
          <div className=" flex items-center gap-2">
            {task.assignees && task.assignees.length > 0 && (
              <div className="flex items-center gap-2">
                {task.assignees.slice(0, 5).map((member) => (
                  <Avatar
                    key={member._id}
                    className="relative size-8 bg-gray-700 rounded-full border-2 border-background overflow-hidden"
                    title={member.name}
                  >
                    <AvatarImage src={member.profilePicture} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ))}
                {task.assignees.length > 5 && (
                  <span className="text-xs text-muted-foreground">
                    + {task.assignees.length - 5}
                  </span>
                )}
              </div>
            )}
          </div>

          {task.dueDate && (
            <div className="text-xs text-muted-foreground flex items-center">
              <Calendar className="size-3 mr-1" />
              {format(new Date(task.dueDate), "MMM d, yyyy")}
            </div>
          )}
        </div>

        {task.subtasks && task.subtasks.length > 0 && (
          <div>
            {task.subtasks.filter((subtask) => subtask.completed).length} /{" "}
            {task.subtasks.length} subtasks
          </div>
        )}
      </CardContent>
    </Card>
  );
};
