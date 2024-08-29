import Tool from "../../../easy-agent/dist/lib/tool";
import type { CreateCommentInput, UpdateCommentInput } from "../../types";
import Linear from "../linear";

export const CreateComment = Tool.create({
  name: "create_comment",
  description: "Creates a comment in Linear",
  inputs: [
    {
      name: "body",
      type: "string",
      description: "The comment content in markdown format",
      required: true,
    },
    {
      name: "issueId",
      type: "string",
      description: "The ID of the issue to associate the comment with",
      required: false,
    },
    {
      name: "parentId",
      type: "string",
      description: "The ID of the parent comment (for nested comments)",
      required: false,
    },
    {
      name: "projectUpdateId",
      type: "string",
      description: "The ID of the project update to associate the comment with",
      required: false,
    },
  ],
  fn: async (inputs: CreateCommentInput) => {
    try {
      const comment = await Linear.createComment(inputs);
      return JSON.stringify(comment);
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
  },
});

export const UpdateComment = Tool.create({
  name: "update_comment",
  description: "Updates an existing comment in Linear",
  inputs: [
    {
      name: "id",
      type: "string",
      description: "The ID of the comment to update",
      required: true,
    },
    {
      name: "body",
      type: "string",
      description: "The new comment content in markdown format",
      required: true,
    },
  ],
  fn: async (inputs: UpdateCommentInput) => {
    try {
      const updatedComment = await Linear.updateComment(inputs);
      return JSON.stringify(updatedComment);
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
  },
});
