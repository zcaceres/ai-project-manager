import type {
  Issue,
  Project,
  Document,
  User,
  WorkflowState,
  ProjectStatus,
  ProjectUpdate,
  IssueLabel,
} from "@linear/sdk";
import { LinearClient } from "@linear/sdk";
import type {
  CreateCommentInput,
  CreateIssueInput,
  CreateMilestoneInput,
  CreateProjectInput,
  CreateProjectUpdateInput,
  DocumentInput,
  UpdateCommentInput,
  UpdateDocumentInput,
  UpdateIssueInput,
  UpdateMilestoneInput,
  UpdateProjectInput,
  UpdateProjectUpdateInput,
} from "../types";

class Linear {
  private client: LinearClient;
  private issueStatuses: WorkflowState[] = [];
  private projectStatuses: ProjectStatus[] = [];
  private projects: Project[] = [];
  private documents: Document[] = [];
  private members: User[] = [];
  private labels: IssueLabel[] = [];

  private constructor(apiKey: string, client?: LinearClient) {
    this.client = client ?? new LinearClient({ apiKey });
  }

  async hydrate() {
    return await Promise.all([
      this.hydrateIssueStatuses(),
      this.hydrateProjectStatuses(),
      this.hydrateDocuments(),
      this.hydrateProjects(),
      this.hydrateOrganizationMembers(),
      this.hydrateLabels(),
    ]);
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

  getIssueStatuses() {
    return this.issueStatuses;
  }

  getProjectStatuses() {
    return this.projectStatuses;
  }

  getProjects() {
    return this.projects;
  }

  getLabels() {
    return this.labels;
  }

  async hydrateLabels() {
    let allLabels: IssueLabel[] = [];
    let hasNextPage = true;
    let endCursor = null;

    while (hasNextPage) {
      const labels = await this.client.issueLabels({
        after: endCursor,
        first: 100,
      });
      allLabels = allLabels.concat(labels.nodes);
      hasNextPage = labels.pageInfo.hasNextPage;
      endCursor = labels.pageInfo.endCursor;
    }

    this.labels = allLabels;
  }

  async hydrateProjects(): Promise<void> {
    let allProjects: Project[] = [];
    let hasNextPage = true;
    let endCursor = null;

    while (hasNextPage) {
      const projects = await this.client.projects({
        after: endCursor,
        first: 100, // Fetch 100 projects at a time
      });

      allProjects = allProjects.concat(projects.nodes);
      hasNextPage = projects.pageInfo.hasNextPage;
      endCursor = projects.pageInfo.endCursor;
    }

    this.projects = allProjects;
  }

  async hydrateDocuments(): Promise<void> {
    let allDocuments: Document[] = [];
    let hasNextPage = true;
    let endCursor = null;

    while (hasNextPage) {
      const documents = await this.client.documents({
        after: endCursor,
        first: 100, // Fetch 100 documents at a time
      });

      allDocuments = allDocuments.concat(documents.nodes);
      hasNextPage = documents.pageInfo.hasNextPage;
      endCursor = documents.pageInfo.endCursor;
    }

    this.documents = allDocuments;
  }

  getDocuments(): Document[] {
    return this.documents;
  }

  async hydrateProjectStatuses(): Promise<void> {
    const team = await this.getTeam();
    if (!team) {
      throw new Error("No team found for the current user");
    }

    const org = await this.client.organization;

    this.projectStatuses = org.projectStatuses;
  }

  async hydrateIssueStatuses(): Promise<void> {
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

  async updateIssue(input: UpdateIssueInput) {
    const issueUpdatedEvent = await this.client.updateIssue(input.issueId, {
      title: input.title,
      description: input.description,
      stateId: input.stateId,
      projectId: input.projectId,
      assigneeId: input.assigneeId,
      dueDate: input.dueDate,
      projectMilestoneId: input.projectMilestoneId,
      estimate: input.estimate,
      priority: input.priority,
      parentId: input.parentId,
    });
    const updatedIssue = await issueUpdatedEvent.issue;
    return updatedIssue;
  }

  async createIssue(input: CreateIssueInput) {
    const team = await this.getTeam();
    if (!team) {
      throw new Error("No team found for the current user");
    }

    const createdIssueEvent = await this.client.createIssue({
      title: input.title,
      description: input.description,
      stateId: input.stateId,
      projectId: input.projectId,
      assigneeId: input.assigneeId,
      dueDate: input.dueDate,
      estimate: input.estimate,
      projectMilestoneId: input.projectMilestoneId,
      priority: input.priority,
      parentId: input.parentId,
      teamId: team.id,
    });

    const createdIssue = await createdIssueEvent.issue;

    return createdIssue;
  }

  async createDocument(inputs: DocumentInput) {
    const documentCreatedEvent = await this.client.createDocument({
      title: inputs.title,
      content: inputs.content,
      projectId: inputs.projectId,
    });
    const documentCreated = await documentCreatedEvent.document;

    return {
      ...documentCreatedEvent,
      document: documentCreated,
    };
  }

  async updateDocument(inputs: UpdateDocumentInput) {
    const updateDocumentEvent = await this.client.updateDocument(
      inputs.documentId,
      {
        title: inputs.title,
        content: inputs.content,
        projectId: inputs.projectId,
      },
    );
    const updatedDocument = await updateDocumentEvent.document;

    return {
      ...updateDocumentEvent,
      document: updatedDocument,
    };
  }

  async createProject(inputs: CreateProjectInput) {
    const team = await this.getTeam();
    if (!team) {
      throw new Error("No team found for the current user");
    }
    const projectCreatedEvent = await this.client.createProject({
      name: inputs.name,
      description: inputs.description,
      leadId: inputs.leadId,
      memberIds: inputs.memberIds,
      priority: inputs.priority,
      startDate: inputs.startDate,
      statusId: inputs.statusId,
      targetDate: inputs.targetDate,
      teamIds: [team.id],
    });

    const projectCreated = await projectCreatedEvent.project;
    const milestones = await projectCreated?.projectMilestones();

    return {
      ...projectCreatedEvent,
      project: {
        ...projectCreated,
        projectMilestones: milestones,
      },
    };
  }

  async updateProject(inputs: UpdateProjectInput) {
    const team = await this.getTeam();
    if (!team) {
      throw new Error("No team found for the current user");
    }

    const projectUpdatedEvent = await this.client.updateProject(
      inputs.projectId,
      {
        name: inputs.name,
        description: inputs.description,
        leadId: inputs.leadId,
        memberIds: inputs.memberIds,
        priority: inputs.priority,
        startDate: inputs.startDate,
        statusId: inputs.statusId,
        targetDate: inputs.targetDate,
        teamIds: [team.id],
      },
    );

    const projectUpdated = await projectUpdatedEvent.project;
    const milestones = await projectUpdated?.projectMilestones();

    return {
      ...projectUpdatedEvent,
      project: {
        ...projectUpdated,
        projectMilestones: milestones,
      },
    };
  }

  async createMilestone(inputs: CreateMilestoneInput) {
    const milestone = await this.client.createProjectMilestone({
      name: inputs.name,
      targetDate: inputs.targetDate,
      description: inputs.description,
      projectId: inputs.projectId,
    });

    if (!milestone.success) {
      throw new Error("Failed to create milestone");
    }

    return milestone.projectMilestone;
  }

  async updateMilestone(inputs: UpdateMilestoneInput) {
    const milestone = await this.client.updateProjectMilestone(
      inputs.milestoneId,
      {
        name: inputs.name,
        targetDate: inputs.targetDate,
        description: inputs.description,
      },
    );

    if (!milestone.success) {
      throw new Error("Failed to create milestone");
    }

    return milestone.projectMilestone;
  }

  async hydrateOrganizationMembers(): Promise<void> {
    let allMembers: User[] = [];
    let hasNextPage = true;
    let endCursor = null;

    while (hasNextPage) {
      const members = await this.client.users({
        after: endCursor,
        first: 100, // Fetch 100 members at a time
      });

      allMembers = allMembers.concat(members.nodes);
      hasNextPage = members.pageInfo.hasNextPage;
      endCursor = members.pageInfo.endCursor;
    }

    this.members = allMembers;
  }

  getOrganizationMembers(): User[] {
    return this.members;
  }

  async createProjectUpdate(inputs: CreateProjectUpdateInput) {
    const projectUpdateCreatedEvent =
      await this.client.createProjectUpdate(inputs);

    if (!projectUpdateCreatedEvent.success) {
      throw new Error("Failed to create project update");
    }

    const projectUpdate = await projectUpdateCreatedEvent.projectUpdate;

    return projectUpdate;
  }

  async updateProjectUpdate(inputs: UpdateProjectUpdateInput) {
    const projectUpdateUpdateEvent = await this.client.updateProjectUpdate(
      inputs.projectUpdateId,
      {
        body: inputs.body,
        health: inputs.health,
      },
    );

    if (!projectUpdateUpdateEvent.success) {
      throw new Error("Failed to update project update");
    }

    const projectUpdate = await projectUpdateUpdateEvent.projectUpdate;

    return projectUpdate;
  }

  async getProjectUpdates(projectId: string) {
    let allProjectUpdates: ProjectUpdate[] = [];
    let hasNextPage = true;
    let endCursor = null;

    while (hasNextPage) {
      const projectUpdates = await this.client.projectUpdates({
        filter: {
          project: { id: { eq: projectId } },
        },
        after: endCursor,
        first: 100, // Fetch 100 updates at a time
      });

      allProjectUpdates = allProjectUpdates.concat(projectUpdates.nodes);
      hasNextPage = projectUpdates.pageInfo.hasNextPage;
      endCursor = projectUpdates.pageInfo.endCursor;
    }

    return allProjectUpdates;
  }

  async createComment(input: CreateCommentInput) {
    const commentCreatedEvent = await this.client.createComment({
      body: input.body,
      issueId: input.issueId,
      parentId: input.parentId,
      projectUpdateId: input.projectUpdateId,
    });

    if (!commentCreatedEvent.success) {
      throw new Error("Failed to create comment");
    }

    return commentCreatedEvent.comment;
  }

  async updateComment(input: UpdateCommentInput) {
    const commentUpdatedEvent = await this.client.updateComment(input.id, {
      body: input.body,
    });

    if (!commentUpdatedEvent.success) {
      throw new Error("Failed to update comment");
    }

    return commentUpdatedEvent.comment;
  }

  async addLabelToIssue(issueId: string, labelId: string) {
    const issue = await this.client.issue(issueId);
    const currentLabelIds = issue.labelIds || [];
    const updatedIssue = await this.client.updateIssue(issueId, {
      labelIds: [...currentLabelIds, labelId],
    });

    if (!updatedIssue.success) {
      throw new Error("Failed to add label to issue");
    }

    return updatedIssue.issue;
  }

  async removeLabelFromIssue(issueId: string, labelId: string) {
    const issue = await this.client.issue(issueId);
    const currentLabelIds = issue.labelIds || [];
    const updatedLabelIds = currentLabelIds.filter((id) => id !== labelId);
    const updatedIssue = await this.client.updateIssue(issueId, {
      labelIds: updatedLabelIds,
    });

    if (!updatedIssue.success) {
      throw new Error("Failed to remove label from issue");
    }

    return updatedIssue.issue;
  }

  static async create(
    apiKey?: string,
    clientOverride?: LinearClient,
  ): Promise<Linear> {
    let linearApiKey = apiKey ?? process.env.LINEAR_API_KEY;

    if (!linearApiKey) {
      throw new Error("No Linear API key provided");
    }

    const linear = new Linear(linearApiKey, clientOverride);
    await linear.hydrate();

    return linear;
  }
}

export default await Linear.create();
