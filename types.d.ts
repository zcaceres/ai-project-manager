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
