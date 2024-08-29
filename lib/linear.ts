import {
  Issue,
  LinearClient,
  Project,
  Document,
  User,
  WorkflowState,
  ProjectStatus,
} from "@linear/sdk";
import type {
  CreateIssueInput,
  CreateMilestoneInput,
  CreateProjectInput,
  CreateProjectUpdateInput,
  DocumentInput,
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
    const updatedIssue = await this.client.updateIssue(input.issueId, {
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
    return updatedIssue;
  }

  async createIssue(input: CreateIssueInput) {
    const team = await this.getTeam();
    if (!team) {
      throw new Error("No team found for the current user");
    }

    const createdIssue = await this.client.createIssue({
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
      projectMilestones: milestones,
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
