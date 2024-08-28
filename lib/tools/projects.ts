import Tool from "../../../easy-agent/dist/lib/tool";
import type { CreateProjectInput, UpdateProjectInput } from "../../types";
import Linear from "../linear";

export const GetProjects = Tool.create({
  name: "get_projects",
  description: "Fetches all projects from Linear",
  inputs: [],
  fn: () => {
    try {
      const projects = Linear.getProjects();
      return JSON.stringify(projects);
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
  },
});

export const CreateProject = Tool.create({
  name: "create_project",
  description: "Creates a project in Linear",
  inputs: [
    {
      name: "name",
      type: "string",
      description: "The name of the project",
      required: true,
    },
    {
      name: "description",
      type: "string",
      description: "The description of the project, character limit of 255",
      required: false,
    },
    {
      name: "leadId",
      type: "string",
      description: "The ID of the project lead",
      required: false,
    },
    {
      name: "memberIds",
      type: "array",
      description: "An array of member IDs to be added to the project",
      required: false,
    },
    {
      name: "priority",
      type: "number",
      description: "The priority of the project",
      required: false,
    },
    {
      name: "startDate",
      type: "string",
      description: "The start date of the project (in ISO 8601 format)",
      required: false,
    },
    {
      name: "statusId",
      type: "string",
      description:
        "The ID of the project workflow status. This nust refer to a project status not an issue status.",
      required: false,
    },
    {
      name: "targetDate",
      type: "string",
      description: "The target date of the project (in ISO 8601 format)",
      required: false,
    },
    // {
    //   name: "teamIds",
    //   type: "array",
    //   description: "An array of team IDs associated with the project",
    //   required: true,
    // },
  ],
  fn: async (inputs: CreateProjectInput) => {
    try {
      const project = await Linear.createProject(inputs);
      return JSON.stringify(project);
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
  },
});

export const UpdateProject = Tool.create({
  name: "update_project",
  description: "Updates an existing project in Linear",
  inputs: [
    {
      name: "projectId",
      type: "string",
      description: "The ID of the project to update",
      required: true,
    },
    {
      name: "name",
      type: "string",
      description: "The new name of the project",
      required: false,
    },
    {
      name: "description",
      type: "string",
      description: "The new description of the project, character limit of 255",
      required: false,
    },
    {
      name: "leadId",
      type: "string",
      description: "The ID of the new project lead",
      required: false,
    },
    {
      name: "memberIds",
      type: "array",
      description:
        "An array of member IDs to be added to or updated in the project",
      required: false,
    },
    {
      name: "priority",
      type: "number",
      description:
        "The new priority of the project (0-4, where 0 is no priority and 4 is urgent)",
      required: false,
    },
    {
      name: "startDate",
      type: "string",
      description: "The new start date of the project (in ISO 8601 format)",
      required: false,
    },
    {
      name: "statusId",
      type: "string",
      description:
        "The ID of the project workflow status. This nust refer to a project status not an issue status.",
      required: false,
    },
    {
      name: "targetDate",
      type: "string",
      description: "The new target date of the project (in ISO 8601 format)",
      required: false,
    },
    // {
    //   name: "teamIds",
    //   type: "array",
    //   description: "An array of team IDs to be associated with the project",
    //   required: true,
    // },
  ],
  fn: async (inputs: UpdateProjectInput) => {
    try {
      const updatedProject = await Linear.updateProject(inputs);
      return JSON.stringify(updatedProject);
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
  },
});

export const GetProjectStatuses = Tool.create({
  name: "get_project_statuses",
  description: "Fetches all project statuses from Linear",
  inputs: [],
  fn: () => {
    try {
      const projectStatuses = Linear.getProjectStatuses();
      return JSON.stringify(projectStatuses);
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
  },
});
