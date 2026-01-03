// Dashboard Workspaces Page
// Displays a list of workspaces, allows creating a new workspace, and shows workspace cards

import { useGetWorkspacesQuery } from "@/hooks/use-workspace";
import { Loader } from "@/components/ui/loader";
import { useState } from "react";
import { Link, useLoaderData } from "react-router";
import type { Workspace } from "@/types";
import { CreateWorkspace } from "@/components/workspace/create-workspace";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users } from "lucide-react";
import { NoDataFound } from "./no-data-found";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WorkspaceAvatar } from "@/components/workspace/workspace-avatar";
import { format } from "date-fns";

// Main component for displaying all workspaces
const Workspaces = () => {
  // State to control the "Create Workspace" modal visibility
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);

  // Fetches the list of workspaces for the current user
  const { data: workspaces, isLoading } = useGetWorkspacesQuery() as {
    data: Workspace[];
    isLoading: boolean;
  };

  // Show loader while fetching workspaces
  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className="space-y-8">
        {/* Header with title and "New Workspace" button */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-3xl font-bold">Workspaces</h2>

          <Button onClick={() => setIsCreatingWorkspace(true)}>
            <PlusCircle className="size-4 mr-2" />
            New Workspace
          </Button>
        </div>

        {/* Grid of workspace cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((ws) => (
            <WorkspaceCard key={ws._id} workspace={ws} />
          ))}

          {/* Show message if no workspaces exist */}
          {workspaces.length === 0 && (
            <NoDataFound
              title="No workspace found"
              description="Create a new workspace to get started"
              buttonText="Create workspace"
              buttonAction={() => setIsCreatingWorkspace(true)}
            />
          )}
        </div>
      </div>
      {/* Modal for creating a new workspace */}
      <CreateWorkspace
        isCreatingWorkspace={isCreatingWorkspace}
        setIsCreatingWorkspace={setIsCreatingWorkspace}
      />
      ;
    </>
  );
};

// Card component for displaying workspace info
const WorkspaceCard = ({ workspace }: { workspace: Workspace }) => {
  return (
    <Link to={`/workspaces/${workspace._id}`}>
      <Card className="transition-all hover:shadow-md hover:-translate-y-1">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {/* Workspace avatar and name */}
              <WorkspaceAvatar name={workspace.name} color={workspace.color} />
              <div>
                <CardTitle>{workspace.name}</CardTitle>
                <span className="text-xs text-muted-foreground">
                  Created at {format(workspace.createdAt, "MMM d, yyyy h:mm a")}
                </span>
              </div>
            </div>

            {/* Number of members in the workspace */}
            <div className="flex items-center text-muted-foreground">
              <Users className="sized-4 mr-1" />
              <span className="text-xs">{workspace.members.length}</span>
            </div>
          </div>

          {/* Workspace description */}
          <CardDescription>
            {workspace.description || "No description"}
          </CardDescription>
        </CardHeader>

        <CardContent className="text-sm text-muted-foreground">
          <div>View workspace details and projects</div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Workspaces;
