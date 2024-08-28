import type { ToolArg } from "../../../easy-agent/dist/definitions";
import Tool from "../../../easy-agent/dist/lib/tool";
import type { CreateIssueInput, UpdateIssueInput } from "../../types";
import Linear from "../linear";

const CreateMutationInputs: ToolArg[] = [
  {
    name: "title",
    type: "string",
    description: "The title of the issue",
    required: true,
  },
  {
    name: "projectId",
    type: "string",
    description: "The ID of the project the issue belongs to",
    required: false,
  },
  {
    name: "description",
    type: "string",
    description: "A detailed description of the issue",
    required: true,
  },
  {
    name: "dueDate",
    type: "string",
    description:
      "The due date of the issue in ISO date format (e.g., '2023-12-31')",
    required: false,
  },
  {
    name: "priority",
    type: "number",
    description:
      "The priority of the issue (0-4, where 0 is no priority and 4 is urgent)",
    required: false,
  },
  {
    name: "stateId",
    type: "string",
    description: "The id of the State (status) of the issue",
    required: false,
  },
  {
    name: "estimate",
    type: "number",
    description: "The estimate of the issue using a 0-5 scale",
    required: false,
  },
  {
    name: "parentId",
    type: "string",
    description: "The ID of the parent issue",
    required: false,
  },
];

const UpdateMutationInputs: ToolArg[] = [
  {
    name: "issueId",
    type: "string",
    description: "The ID of the issue to update",
    required: true,
  },
  {
    name: "projectId",
    type: "string",
    description: "The ID of the project the issue belongs to",
    required: false,
  },
  {
    name: "title",
    type: "string",
    description: "The title of the issue",
    required: false,
  },
  {
    name: "description",
    type: "string",
    description: "A detailed description of the issue",
    required: false,
  },
  {
    name: "dueDate",
    type: "string",
    description:
      "The due date of the issue in ISO date format (e.g., '2023-12-31')",
    required: false,
  },
  {
    name: "priority",
    type: "number",
    description:
      "The priority of the issue (0-4, where 0 is no priority and 4 is urgent)",
    required: false,
  },
  {
    name: "stateId",
    type: "string",
    description:
      "The id of the State (issue or 'workflow' status) of the issue",
    required: false,
  },
  {
    name: "estimate",
    type: "number",
    description: "The estimate of the issue using a 0-5 scale",
    required: false,
  },
  {
    name: "parentId",
    type: "string",
    description: "The ID of the parent issue",
    required: false,
  },
];

export const GetIssues: Tool = Tool.create({
  name: "get_issues",
  description: "Fetches all issues from Linear",
  inputs: [],
  fn: async () => {
    try {
      const issues = await Linear.getAllIssues();
      return JSON.stringify(issues);
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
  },
});

export const UpdateIssue: Tool = Tool.create({
  name: "update_issue",
  description: "Updates an existing Linear Issue",
  inputs: UpdateMutationInputs,
  fn: async (inputs: UpdateIssueInput) => {
    try {
      const updatedIssue = await Linear.updateIssue(inputs);
      return JSON.stringify(updatedIssue);
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
  },
});

export const CreateIssue: Tool = Tool.create({
  name: "create_issue",
  description:
    "Creates a Linear Issue with a title, description, dueDate and priority.",
  inputs: CreateMutationInputs,
  fn: async (inputs: CreateIssueInput) => {
    try {
      const createdIssue = await Linear.createIssue(inputs);
      return "Successfully created issue";
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
  },
});

export const GetIssueStatuses = Tool.create({
  name: "get_issues_statuses",
  description:
    "Fetches all 'states' from Linear which become the statuses of an issue",
  inputs: [],
  fn: () => {
    try {
      const workflowStates = Linear.getIssueStatuses();
      return JSON.stringify(workflowStates);
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
  },
});
