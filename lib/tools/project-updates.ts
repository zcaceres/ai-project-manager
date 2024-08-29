import Tool from "../../../easy-agent/dist/lib/tool";
import type {
  CreateProjectUpdateInput,
  UpdateProjectUpdateInput,
} from "../../types";
import Linear from "../linear";

export const CreateProjectUpdate = Tool.create({
  name: "create_project_update",
  description:
    "Creates a project update in Linear which informs stakeholders of the project's status",
  inputs: [
    {
      name: "projectId",
      type: "string",
      description: "The ID of the project to create an update for",
      required: true,
    },
    {
      name: "body",
      type: "string",
      description: "The content of the project update",
      required: true,
    },
    {
      name: "health",
      type: "string",
      description:
        "The health status of the project (e.g., 'onTrack', 'atRisk', 'offTrack')",
      required: true,
    },
  ],
  fn: async (inputs: CreateProjectUpdateInput) => {
    try {
      const projectUpdate = await Linear.createProjectUpdate(inputs);
      return JSON.stringify(projectUpdate);
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
  },
});

export const UpdateProjectUpdate = Tool.create({
  name: "update_project_update",
  description:
    "Updates an existing project update in Linear which informs stakeholders of the project's status",
  inputs: [
    {
      name: "projectUpdateId",
      type: "string",
      description: "The ID of the project update to modify",
      required: true,
    },
    {
      name: "body",
      type: "string",
      description: "The new content of the project update",
      required: true,
    },
    {
      name: "health",
      type: "string",
      description:
        "The new health status of the project (e.g., 'onTrack', 'atRisk', 'offTrack')",
      required: false,
    },
  ],
  fn: async (inputs: UpdateProjectUpdateInput) => {
    try {
      const updatedProjectUpdate = await Linear.updateProjectUpdate(inputs);
      return JSON.stringify(updatedProjectUpdate);
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
  },
});

export const GetProjectUpdates = Tool.create({
  name: "get_project_updates",
  description:
    "Retrieves all project updates for a given project ID from Linear",
  inputs: [
    {
      name: "projectId",
      type: "string",
      description: "The ID of the project to fetch updates for",
      required: true,
    },
  ],
  fn: async (inputs: { projectId: string }) => {
    try {
      const projectUpdates = await Linear.getProjectUpdates(inputs.projectId);
      return JSON.stringify(projectUpdates);
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
  },
});
