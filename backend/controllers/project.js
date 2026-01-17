// This file contains the backend logic for creating a new project in a workspace

import Workspace from "../models/workspace.js";
import Project from "../models/project.js";

const createProject = async (req, res) => {
  try {
    // Gets workspace ID from the URL and project details from the request body
    const { workspaceId } = req.params;
    const { title, description, status, startDate, dueDate, tags, members } =
      req.body;

    // Finds the workspace by its ID
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      // If workspace doesn't exist, send an error response
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    // Checks if the user is a member of the workspace
    const isMember = workspace.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      // If not a member, deny access
      return res.status(403).json({
        message: "You are not a member of this workspace",
      });
    }

    // Converts tags from a comma-separated string to an array
    const tagArray = tags ? tags.split(",") : [];

    // Creates a new project with the provided details
    const newProject = await Project({
      title,
      description,
      status,
      startDate,
      dueDate,
      tags: tagArray,
      workspace: workspaceId,
      members,
      createdBy: req.user._id,
    });

    // Adds the new project's ID to the workspace's list of projects
    workspace.projects.push(newProject._id);
    await workspace.save();

    // Sends the new project as the response
    return res.status(201).json(newProject);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export { createProject };
