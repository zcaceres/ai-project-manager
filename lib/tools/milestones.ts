import type { ToolArg } from "../../../easy-agent/dist/definitions";
import Tool from "../../../easy-agent/dist/lib/tool";
import type { CreateMilestoneInput, UpdateMilestoneInput } from "../../types";
import Linear from "../linear";

const CreateMilestoneInputs: ToolArg[] = [
  {
    name: "name",
    type: "string",
    description: "The name of the milestone",
    required: true,
  },
  {
    name: "description",
    type: "string",
    description: "A detailed description of the milestone",
    required: false,
  },
  {
    name: "targetDate",
    type: "string",
    description:
      "The target date of the milestone in ISO date format (e.g., '2023-12-31')",
    required: false,
  },
  {
    name: "projectId",
    type: "string",
    description: "The ID of the project the milestone belongs to",
    required: true,
  },
];

const UpdateMilestoneInputs: ToolArg[] = [
  {
    name: "milestoneId",
    type: "string",
    description: "The ID of the milestone to update",
    required: true,
  },
  {
    name: "name",
    type: "string",
    description: "The new name of the milestone",
    required: false,
  },
  {
    name: "description",
    type: "string",
    description: "The new description of the milestone",
    required: false,
  },
  {
    name: "targetDate",
    type: "string",
    description:
      "The new target date of the milestone in ISO date format (e.g., '2023-12-31')",
    required: false,
  },
];

export const CreateMilestone: Tool = Tool.create({
  name: "create_milestone",
  description: "Creates a new milestone in a Linear project",
  inputs: CreateMilestoneInputs,
  fn: async (inputs: CreateMilestoneInput) => {
    try {
      const createdMilestone = await Linear.createMilestone(inputs);
      return JSON.stringify(createdMilestone);
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
  },
});

export const UpdateMilestone: Tool = Tool.create({
  name: "update_milestone",
  description: "Updates an existing milestone in a Linear project",
  inputs: UpdateMilestoneInputs,
  fn: async (inputs: UpdateMilestoneInput) => {
    try {
      const updatedMilestone = await Linear.updateMilestone(inputs);
      return JSON.stringify(updatedMilestone);
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
  },
});
