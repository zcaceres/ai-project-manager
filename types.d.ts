// Sub-type of `IssueUpdateInput`
export type CreateTicketInput = {
  title: string;
  description: string;
  stateId?: string;
  dueDate?: string;
  priority?: number;
};

export type UpdateTicketInput = {
  issueId: string;
} & Partial<CreateTicketInput>;

// Sub-type of `DocumentCreateInput`
export type PRDInput = {
  title: string;
  content: string;
  projectId: string;
};
