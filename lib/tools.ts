import { Tool } from "easy-agent";
import Linear from "./linear";
import type { CreateTicketInput, UpdateTicketInput } from "../types";

export const GetIssues: Tool = Tool.create({
  name: "get_all_issues",
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
  inputs: [
    {
      name: "issueId",
      type: "string",
      description: "The ID of the issue to update",
      required: true,
    },
    {
      name: "title",
      type: "string",
      description: "The title of the ticket",
      required: false,
    },
    {
      name: "description",
      type: "string",
      description: "A detailed description of the ticket",
      required: false,
    },
    {
      name: "dueDate",
      type: "string",
      description:
        "The due date of the ticket in ISO date format (e.g., '2023-12-31')",
      required: false,
    },
    {
      name: "priority",
      type: "number",
      description:
        "The priority of the ticket (0-4, where 0 is no priority and 4 is urgent)",
      required: false,
    },
    {
      name: "stateId",
      type: "string",
      description: "The id of the State (status) of the ticket",
      required: false,
    },
  ],
  fn: async (inputs: UpdateTicketInput) => {
    try {
      const updatedIssue = await Linear.updateIssue(inputs);
      return JSON.stringify(updatedIssue);
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
  },
});

export const CreateIssue: Tool = Tool.create({
  name: "create_ticket",
  description:
    "Creates a Linear Issue with a title, description, dueDate and priority.",
  inputs: [
    {
      name: "title",
      type: "string",
      description: "The title of the ticket",
      required: true,
    },
    {
      name: "description",
      type: "string",
      description: "A detailed description of the ticket",
      required: true,
    },
    {
      name: "dueDate",
      type: "string",
      description:
        "The due date of the ticket in ISO date format (e.g., '2023-12-31')",
      required: false,
    },
    {
      name: "priority",
      type: "number",
      description:
        "The priority of the ticket (0-4, where 0 is no priority and 4 is urgent)",
      required: false,
    },
    {
      name: "stateId",
      type: "string",
      description: "The id of the State (status) of the ticket",
      required: false,
    },
    // {
    //   name: "teamId",
    //   type: "string",
    //   description: "The ID of the team the ticket belongs to",
    //   required: true,
    // },
    // {
    //   name: "assigneeId",
    //   type: "string",
    //   description: "The ID of the user to assign the ticket to",
    //   required: false,
    // },
    // {
    //   name: "estimate",
    //   type: "number",
    //   description: "The estimated time or points for the ticket",
    //   required: false,
    // },
    // {
    //   name: "projectId",
    //   type: "string",
    //   description: "The ID of the project the ticket belongs to",
    //   required: false,
    // },
    // {
    //   name: "labelIds",
    //   type: "array",
    //   description: "An array of label IDs to apply to the ticket",
    //   required: false,
    // },
  ],
  fn: async (inputs: CreateTicketInput) => {
    try {
      const createdTicket = await Linear.createTicket(inputs);
      console.dir(createdTicket);
      return "Successfully created ticket";
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
  },
});

export const GetWorkflowStates = Tool.create({
  name: "get_workflow_states",
  description:
    "Fetches all 'states' from Linear which become the statuses of an issue",
  inputs: [],
  fn: () => {
    try {
      const workflowStates = Linear.getWorkflowStates();
      return JSON.stringify(workflowStates);
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
  },
});
