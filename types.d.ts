// Sub-type of `IssueUpdateInput`
export type CreateTicketInput = {
  title: string;
  description: string;
  stateId?: string;
  dueDate?: string;
  priority?: number;
  projectId?: string;
};

export type UpdateTicketInput = {
  issueId: string;
} & Partial<CreateTicketInput>;

// Sub-type of `DocumentCreateInput`
export type DocumentInput = {
  title: string;
  content: string;
  projectId: string;
};

export type UpdateDocumentInput = {
  documentId: string;
} & Partial<DocumentInput>;
