import { Issue, LinearClient, User, WorkflowState } from "@linear/sdk";
import type { CreateTicketInput, UpdateTicketInput } from "../types";

class Linear {
  private client: LinearClient;
  private issueStatuses: WorkflowState[] = [];

  private constructor(apiKey: string, client?: LinearClient) {
    this.client = client ?? new LinearClient({ apiKey });
    this.hydrateStatuses();
  }

  async getCurrentUser(): Promise<User> {
    return this.client.viewer;
  }

  async getTeam() {
    const me = await this.getCurrentUser();
    const team = await me.teams();
    // @TODO: Make this not so brittle
    const firstTeam = team.nodes[0];
    return firstTeam;
  }

  getWorkflowStates() {
    return this.issueStatuses;
  }

  async hydrateStatuses(): Promise<void> {
    const team = await this.getTeam();
    if (!team) {
      throw new Error("No team found for the current user");
    }

    let allStates: WorkflowState[] = [];
    let hasNextPage = true;
    let endCursor = null;

    while (hasNextPage) {
      const states = await this.client.workflowStates({
        filter: { team: { id: { eq: team.id } } },
        after: endCursor,
        first: 100, // Fetch 100 states at a time
      });

      allStates = allStates.concat(states.nodes);
      hasNextPage = states.pageInfo.hasNextPage;
      endCursor = states.pageInfo.endCursor;
    }

    this.issueStatuses = allStates;
  }

  async getAllIssues() {
    const team = await this.getTeam();
    if (!team) {
      throw new Error("No team found for the current user");
    }

    let allIssues: Issue[] = [];
    let hasNextPage = true;
    let endCursor = null;

    while (hasNextPage) {
      const issues = await this.client.issues({
        filter: { team: { id: { eq: team.id } } },
        after: endCursor,
        first: 100, // Fetch 100 issues at a time
      });

      allIssues = allIssues.concat(issues.nodes);
      hasNextPage = issues.pageInfo.hasNextPage;
      endCursor = issues.pageInfo.endCursor;
    }

    return allIssues;
  }

  async updateIssue(input: UpdateTicketInput) {
    const updatedIssue = await this.client.updateIssue(input.issueId, {
      title: input.title,
      description: input.description,
      stateId: input.stateId,
      // assigneeId: user.id,
      // dueDate: input.dueDate,
      // priority: input.priority,
      // teamId: team.id,
    });
    return updatedIssue;
  }

  async createTicket(input: CreateTicketInput) {
    const team = await this.getTeam();
    const user = await this.getCurrentUser();
    if (!team) {
      throw new Error("No team found for the current user");
    }

    const createdIssue = await this.client.createIssue({
      title: input.title,
      description: input.description,
      assigneeId: user.id,
      stateId: input.stateId,
      // dueDate: input.dueDate,
      // priority: input.priority,
      teamId: team.id,
    });

    return createdIssue;
  }

  static async create(
    apiKey?: string,
    clientOverride?: LinearClient,
  ): Promise<Linear> {
    let linearApiKey = apiKey ?? process.env.LINEAR_API_KEY;

    if (!linearApiKey) {
      throw new Error("No Linear API key provided");
    }

    return new Linear(linearApiKey, clientOverride);
  }

  // static mocked() {
  //   return {
  //     async getCurrentUser(): Promise<User> {
  //       return {
  //         id: "user1",
  //         name: "Test User",
  //         email: "test@example.com",
  //         active: true,
  //         createdAt: new Date().toISOString(),
  //         updatedAt: new Date().toISOString(),
  //       } as User;
  //     },

  //     async getTeam(): Promise<TeamConnection> {
  //       // @ts-expect-error
  //       return {
  //         nodes: [
  //           // @ts-expect-error
  //           {
  //             id: "team1",
  //             name: "Test Team",
  //             key: "TEST",
  //             createdAt: new Date().toISOString(),
  //             updatedAt: new Date().toISOString(),
  //           } as Team,
  //         ],
  //         pageInfo: {
  //           hasNextPage: false,
  //           endCursor: null,
  //         },
  //       } as TeamConnection;
  //     },
  //     async createTicket(input: CreateIssueInput): Promise<IssuePayload> {
  //       // @ts-expect-error
  //       return {
  //         success: true,
  //         // @ts-expect-error
  //         issue: {
  //           id: "issue1",
  //           title: input.title,
  //           description: input.description,
  //           teamId: input.teamId,
  //           createdAt: new Date().toISOString(),
  //           updatedAt: new Date().toISOString(),
  //         } as Issue,
  //         lastSyncId: 1,
  //       } as IssuePayload;
  //     },
  //   };
  // }
}

export default await Linear.create();
