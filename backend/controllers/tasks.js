// Backend logic for creating a new task in a project

import Project from "../models/project.js";
import Task from "../models/task.js";
import Workspace from "../models/workspace.js";

const createTasks = async (req, res) => {
  try {
    // Gets project ID from the URL
    const { projectId } = req.params;
    // Gets task details from the request body
    const { title, description, status, priority, dueDate, assignees } =
      req.body;

    //   Finds the project by its ID
    const project = await Project.findById(projectId);

    // Sends error if project doesn't exist
    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Finds the workspace that owns this project
    const workspace = await Workspace.findById(project.workspace);

    // Sends error if workspace doesn't exist
    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    // Checks if the user is a member of the workspace
    const isMember = workspace.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );

    // Denys access if the user is a member of the workspace
    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this workspace",
      });
    }

    // Creates a new task with these details
    const newTask = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      assignees,
      project: projectId,
      createdBy: req.user._id,
    });

    // Adds the new task's ID to the project's task list
    project.tasks.push(newTask._id);
    await project.save();

    // Sends the newly created task as response
    res.status(201).json(newTask);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export { createTasks };
