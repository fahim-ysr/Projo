// Workspace Details Page
// Displays details for a single workspace, including header and actions

import { Loader } from "@/components/ui/loader";
import { WorkspaceHeader } from "@/components/workspace/workspace-header";
import { useGetWorkspaceQuery } from "@/hooks/use-workspace";
import type { Project, Workspace } from "@/types";
import { useState } from "react";
import { useParams } from "react-router";

const WorkspaceDetails = () => {
  // Get workspaceId from route params
  const { workspaceId } = useParams<{ workspaceId: string }>();

  // State for modals (create project, invite member)
  const [isCreateProject, setIsCreateProject] = useState(false);
  const [isInviteMember, setIsInviteMember] = useState(false);

  // Show message if workspaceId is missing
  if (!workspaceId) {
    return <div>No workspace found</div>;
  }

  // Fetch workspace details and projects
  const { data, isLoading } = useGetWorkspaceQuery(workspaceId) as {
    data: {
      workspace: Workspace;
      projects: Project[];
    };

    isLoading: boolean;
  };

  // Show loader while fetching data
  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Workspace header with actions */}
      <WorkspaceHeader
        workspace={data.workspace}
        members={data?.workspace?.members as any}
        onCreateProject={() => setIsCreateProject(true)}
        onInviteMember={() => setIsInviteMember(true)}
      />
    </div>
  );
};

export default WorkspaceDetails;
