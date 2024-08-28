import Tool from "../../../easy-agent/dist/lib/tool";
import type { DocumentInput } from "../../types";
import Linear from "../linear";

const CreateMutationInputs = [
  {
    name: "title",
    type: "string",
    description: "The title of the document/PRD",
    required: true,
  },
  {
    name: "content",
    type: "string",
    description: "The content of the document/PRD as a Markdown string",
    required: true,
  },
  {
    name: "projectId",
    type: "string",
    description: "The ID of the project the document/PRD belongs to",
    required: true,
  },
];

const UpdateMutationInputs = [
  {
    name: "documentId",
    type: "string",
    description: "The ID of the document/PRD to update",
    required: true,
  },
  {
    name: "title",
    type: "string",
    description: "The title of the document",
    required: false,
  },
  {
    name: "content",
    type: "string",
    description: "The content of the document as a Markdown string",
    required: false,
  },
  {
    name: "projectId",
    type: "string",
    description: "The ID of the project the document belongs to",
    required: false,
  },
];

export const CreateDocument = Tool.create({
  name: "create_document",
  description: "Creates a new document/PRD in Linear",
  inputs: CreateMutationInputs,
  fn: async (inputs: DocumentInput) => {
    try {
      const createdPRD = await Linear.createDocument(inputs);
      return JSON.stringify(createdPRD);
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
  },
});

export const UpdateDocument = Tool.create({
  name: "update_document",
  description: "Updates an existing PRD in Linear",
  inputs: UpdateMutationInputs,
});

export const GetDocuments: Tool = Tool.create({
  name: "get_documents",
  description: "Fetches all documents/PRDs from Linear",
  inputs: [],
  fn: async () => {
    try {
      const documents = Linear.getDocuments();
      return JSON.stringify(documents);
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
  },
});
