// Card component for displaying a single project's summary information

import type { Project } from "@/types";
import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { cn } from "@/lib/utils";
import { getTaskStatusColor } from "@/lib";
import { Progress } from "../ui/progress";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  progress: number;
  workspaceId: string;
}

// Renders a card with project details
export const ProjectCard = ({
  project,
  progress,
  workspaceId,
}: ProjectCardProps) => {
  return (
    // Clicking the card navigates to the project details page
    <Link to={`/workspaces/${workspaceId}/projects/${project._id}`}>
      <Card className="transition-all duration-300 hover:shadow-md translate-y-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            {/* Project Title */}
            <CardTitle>{project.title}</CardTitle>
            {/* Project status badge with color */}
            <span
              className={cn(
                "text-xs rounded-full",
                getTaskStatusColor(project.status)
              )}
            >
              {project.status}
            </span>
          </div>
          {/* Project description or default text */}
          <CardDescription className="line-clam-2">
            {project.description || "No description"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Progress bar showing completion percentage */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>

              <Progress value={progress} className="h-2" />
            </div>
            {/* Task count and due date */}
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm gap-2 text-muted-foreground">
                <span>{project.tasks.length}</span>
                <span>Tasks</span>
              </div>

              {/* Shows due date if it exists */}
              {project.dueDate && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <CalendarDays className="w-4 h-4" />
                  <span>{format(project.dueDate, "MMM d, yyyy")}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
