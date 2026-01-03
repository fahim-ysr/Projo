// Workspace Header Component
// Shows workspace avatar, name, and provides actions for creating projects or inviting members

import type { Workspace, User } from "@/types";
import { WorkspaceAvatar } from "./workspace-avatar";

interface WorkspaceHeaderProps {
  workspace: Workspace;
  members: {
    _id: string;
    user: User;
    role: "admin" | "member" | "owner" | "viewer";
    joinedAt: Date;
  }[];
  onCreateProject: () => void;
  onInviteMember: () => void;
}

// Renders workspace header with avatar and action buttons
export const WorkspaceHeader = ({
  workspace,
  members,
  onCreateProject,
  onInviteMember,
}: WorkspaceHeaderProps) => {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        {/* Layout for workspace info and actions */}
        <div className="flex flex-col-reverse md:flex-row md:justify-between md:items-center gap-3"></div>
        <div className="flex md:items-center gap-3">
          {/* Workspace avatar */}
          {workspace.color && (
            <WorkspaceAvatar color={workspace.color} name={workspace.name} />
          )}
        </div>
      </div>
    </div>
  );
};
