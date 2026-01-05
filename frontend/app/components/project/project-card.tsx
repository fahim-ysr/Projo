// Card component for displaying a single project's summary information
import type { Project } from "@/types";

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
  return <div></div>;
};
