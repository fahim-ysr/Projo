// Header component for the app, shows workspace selector and user menu

import { useAuth } from "@/provider/auth-context";
import type { Workspace } from "@/types";
import { Button } from "../ui/button";
import { Bell, PlusCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Link, useLoaderData } from "react-router";
import { WorkspaceAvatar } from "../workspace/workspace-avatar";
import { DropdownMenuGroup } from "../ui/dropdown-menu";

interface HeaderProps {
  onWorkspaceSelected: (workspace: Workspace) => void;
  selectedWorkspace: Workspace | null;
  onCreateWorkspace: () => void;
}

export const Header = ({
  onWorkspaceSelected,
  selectedWorkspace,
  onCreateWorkspace,
}: HeaderProps) => {
  const { user, logout } = useAuth();
  const { workspaces } = useLoaderData() as { workspaces: Workspace[] };
  console.log(workspaces);

  return (
    <div className="bg-background sticky top-0 z-40 border-b">
      {/* Workspace selector */}
      <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8 py-4"></div>
      <></>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"outline"}>
            {selectedWorkspace ? (
              <>
                {selectedWorkspace.color && (
                  <WorkspaceAvatar
                    color={selectedWorkspace.color}
                    name={selectedWorkspace.name}
                  />
                )}
                <span className="font-medium">{selectedWorkspace?.name}</span>
              </>
            ) : (
              <span className="font-medium">Select Workspace</span>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenu>Workspace</DropdownMenu>
          <DropdownMenuSeparator />
          {/* List of workspaces */}
          <DropdownMenuGroup>
            {workspaces.map((ws) => (
              <DropdownMenuItem
                key={ws._id}
                onClick={() => onWorkspaceSelected(ws)}
              >
                {ws.color && (
                  <WorkspaceAvatar name={ws.name} color={ws.color} />
                )}
                <span className="ml-2">{ws.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          {/* Create new workspace option */}
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={onCreateWorkspace}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Create Workspace
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* User menu and notifications */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Bell />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full border p-1 w-8 h-8">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.profilePicture} alt={user?.name} />
                <AvatarFallback className="bg-black text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <Link to="/user/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={logout}>Log Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
