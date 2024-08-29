import Tool from "../../../easy-agent/dist/lib/tool";
import type {
  AddLabelToIssueInput,
  RemoveLabelFromIssueInput,
} from "../../types";
import Linear from "../linear";

export const GetLabels = Tool.create({
  name: "get_labels",
  description: "Retrieves all labels from the Linear system",
  inputs: [],
  fn: async () => {
    try {
      const labels = Linear.getLabels();
      return JSON.stringify(labels);
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
  },
});

export const AddLabelToIssue = Tool.create({
  name: "add_label_to_issue",
  description: "Assigns a label to an issue in Linear",
  inputs: [
    {
      name: "issueId",
      type: "string",
      description: "The ID of the issue to add the label to",
      required: true,
    },
    {
      name: "labelId",
      type: "string",
      description: "The ID of the label to add to the issue",
      required: true,
    },
  ],
  fn: async (inputs: AddLabelToIssueInput) => {
    try {
      const updatedIssue = await Linear.addLabelToIssue(
        inputs.issueId,
        inputs.labelId,
      );
      return JSON.stringify(updatedIssue);
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
  },
});

export const RemoveLabelFromIssue = Tool.create({
  name: "remove_label_from_issue",
  description: "Removes a label from an issue in Linear",
  inputs: [
    {
      name: "issueId",
      type: "string",
      description: "The ID of the issue to remove the label from",
      required: true,
    },
    {
      name: "labelId",
      type: "string",
      description: "The ID of the label to remove from the issue",
      required: true,
    },
  ],
  fn: async (inputs: RemoveLabelFromIssueInput) => {
    try {
      const updatedIssue = await Linear.removeLabelFromIssue(
        inputs.issueId,
        inputs.labelId,
      );
      return JSON.stringify(updatedIssue);
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
  },
});
