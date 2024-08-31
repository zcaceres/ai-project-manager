import { beforeEach, describe, it, expect, mock } from "bun:test";
import Linear from "../lib/linear";
import type {
  Issue,
  Document,
  Comment,
  Project,
  Team,
  User,
  WorkflowState,
  ProjectMilestone,
  ProjectUpdate,
  IssueLabel,
  ProjectMilestoneConnection,
} from "@linear/sdk";
import type { ProjectUpdateHealthType } from "@linear/sdk/dist/_generated_documents";

describe("Linear module", async () => {
  it("gets the current user", async () => {
    // Mock the getCurrentUser method with a more complete User object
    const mockUser: User = {
      id: "user-1",
      name: "linear@zach.dev",
      email: "linear@zach.dev",
      active: true,
      admin: false,
      avatarUrl: "https://example.com/avatar.jpg",
      createdAt: new Date(),
      updatedAt: new Date(),
      displayName: "Zach",
      archivedAt: undefined,
      avatarBackgroundColor: "#FFFFFF",
      timezone: "UTC",
      description: "",
      url: "https://linear.app/user/user-1",
      // Add any other fields required by your specific use of the User type
    } as User;

    const originalGetCurrentUser = Linear.getCurrentUser;
    Linear.getCurrentUser = mock(() => Promise.resolve(mockUser));

    const user = await Linear.getCurrentUser();
    expect(user).toBeDefined();
    expect(user.name).toBe("linear@zach.dev");
    expect(user.email).toBe("linear@zach.dev");
    expect(user.id).toBe("user-1");
    expect(user.active).toBe(true);
    expect(user.admin).toBe(false);

    // Restore the original method
    Linear.getCurrentUser = originalGetCurrentUser;
  });

  it("gets a valid team", async () => {
    const mockTeam: Partial<Team> = {
      id: "team-1",
      name: "Linear PM",
      key: "LPM",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const originalGetTeam = Linear.getTeam;
    Linear.getTeam = mock(() => Promise.resolve(mockTeam as Team));

    const team = await Linear.getTeam();
    expect(team).toBeDefined();
    expect(team.id).toBeDefined();
    expect(team.name).toEqual("Linear PM");

    Linear.getTeam = originalGetTeam;
  });

  it("creates an issue", async () => {
    const issueInput = {
      title: "Test Issue",
      description: "This is a test issue",
    };

    const mockIssue: Partial<Issue> = {
      id: "issue-1",
      title: "Test Issue",
      description: "This is a test issue",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const originalCreateIssue = Linear.createIssue;
    Linear.createIssue = mock(() => Promise.resolve(mockIssue as Issue));

    const createdIssue = await Linear.createIssue(issueInput);
    expect(createdIssue).toBeDefined();
    expect(createdIssue!.title).toBe("Test Issue");
    expect(createdIssue!.description).toBe("This is a test issue");

    Linear.createIssue = originalCreateIssue;
  });

  it("gets all issues", async () => {
    const mockIssues: Partial<Issue>[] = [
      { id: "issue-1", title: "Issue 1" },
      { id: "issue-2", title: "Issue 2" },
    ];

    const originalGetAllIssues = Linear.getAllIssues;
    Linear.getAllIssues = mock(() => Promise.resolve(mockIssues as Issue[]));

    const issues = await Linear.getAllIssues();
    expect(issues).toBeDefined();
    expect(issues.length).toBe(2);

    Linear.getAllIssues = originalGetAllIssues;
  });

  it("gets all workflow states", async () => {
    const mockWorkflowStates: Partial<WorkflowState>[] = [
      { id: "state-1", name: "Todo", type: "unstarted" },
      { id: "state-2", name: "In Progress", type: "started" },
      { id: "state-3", name: "Done", type: "completed" },
    ];

    const originalGetIssueStatuses = Linear.getIssueStatuses;
    Linear.getIssueStatuses = mock(() => mockWorkflowStates as WorkflowState[]);

    const workflowStates = Linear.getIssueStatuses();
    expect(workflowStates).toBeDefined();
    expect(workflowStates.length).toBe(3);
    expect(workflowStates.find((state) => state.name === "Todo")!.name).toBe(
      "Todo",
    );

    Linear.getIssueStatuses = originalGetIssueStatuses;
  });

  it("gets all projects", async () => {
    const mockProjects: Partial<Project>[] = [
      { id: "project-1", name: "AI Agent Test Project" },
      { id: "project-2", name: "Another Project" },
    ];

    const originalGetProjects = Linear.getProjects;
    Linear.getProjects = mock(() => mockProjects as Project[]);

    const projects = Linear.getProjects();
    expect(projects).toBeDefined();
    expect(projects.length).toBe(2);
    expect(projects[0].name).toBe("AI Agent Test Project");

    Linear.getProjects = originalGetProjects;
  });

  it("creates a document", async () => {
    const mockProjects: Partial<Project>[] = [
      { id: "project-1", name: "AI Agent Test Project" },
    ];

    const documentInput = {
      title: "Test Document",
      content: "This is a test document",
      projectId: "project-1",
    };

    const mockDocument: Document = {
      id: "doc-1",
      title: "Test Document",
      content: "This is a test document",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Document;

    const originalGetProjects = Linear.getProjects;
    Linear.getProjects = mock(() => mockProjects as Project[]);

    const originalCreateDocument = Linear.createDocument;
    Linear.createDocument = mock(() =>
      Promise.resolve({
        document: mockDocument as Document,
        success: true,
        lastSyncId: 2,
      }),
    );

    const documentCreatedEvent = await Linear.createDocument(documentInput);
    expect(documentCreatedEvent).toBeDefined();
    expect(documentCreatedEvent.success).toEqual(true);
    expect(documentCreatedEvent.document!.title).toBe("Test Document");
    expect(documentCreatedEvent.document!.content).toBe(
      "This is a test document",
    );

    Linear.getProjects = originalGetProjects;
    Linear.createDocument = originalCreateDocument;
  });

  it("gets all documents", async () => {
    const mockDocuments: Partial<Document>[] = [
      { id: "doc-1", title: "Document 1" },
      { id: "doc-2", title: "Document 2" },
    ];

    const originalGetDocuments = Linear.getDocuments;
    Linear.getDocuments = mock(() => mockDocuments as Document[]);

    const documents = Linear.getDocuments();
    expect(documents).toBeDefined();
    expect(documents.length).toBe(2);

    Linear.getDocuments = originalGetDocuments;
  });

  it("assigns a leadId and memberIds", async () => {
    const otherMockedUser = { id: "user-2", name: "Another User" } as User;
    const mockIssues: Issue[] = [
      {
        id: "issue-1",
        title: "Test Issue",
        assignee: Promise.resolve(otherMockedUser),
      },
    ] as Issue[];

    const mockUser: Partial<User> = {
      id: "user-1",
      name: "Test User",
    };

    const originalGetAllIssues = Linear.getAllIssues;
    const originalGetCurrentUser = Linear.getCurrentUser;
    const originalUpdateIssue = Linear.updateIssue;
    const originalHydrate = Linear.hydrate;

    Linear.getAllIssues = mock(() => Promise.resolve(mockIssues as Issue[]));
    Linear.getCurrentUser = mock(() => Promise.resolve(mockUser as User));
    Linear.updateIssue = mock(() => Promise.resolve(mockIssues[0]));

    let issues = await Linear.getAllIssues();
    const user = await Linear.getCurrentUser();

    await Linear.updateIssue({
      issueId: issues[0].id,
      assigneeId: user.id,
    });

    issues = await Linear.getAllIssues();
    const updatedIssue = issues.find((issue) => issue.id === issues[0].id)!;
    const assignee = await updatedIssue.assignee;
    expect(assignee!.id).toBe(otherMockedUser.id);

    Linear.getAllIssues = originalGetAllIssues;
    Linear.getCurrentUser = originalGetCurrentUser;
    Linear.updateIssue = originalUpdateIssue;
    Linear.hydrate = originalHydrate;
  });

  it("updates a document", async () => {
    const updateInput = {
      documentId: "doc-1",
      title: "Updated Document",
      content: "This is updated content",
      projectId: "project-1",
    };

    const mockUpdatedDocument: Partial<Document> = {
      id: "doc-1",
      title: "Updated Document",
      content: "This is updated content",
      project: Promise.resolve({
        id: "project-1",
        name: "Test Project",
        description: "This is a test project",
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Project),
      updatedAt: new Date(),
    };

    const originalUpdateDocument = Linear.updateDocument;
    Linear.updateDocument = mock(() =>
      Promise.resolve({
        document: mockUpdatedDocument as Document,
        success: true,
        lastSyncId: 0,
      }),
    );

    const result = await Linear.updateDocument(updateInput);

    const resultDocument = result.document;
    expect(result.success).toBe(true);
    expect(resultDocument!.title).toBe("Updated Document");
    expect(resultDocument!.content).toBe("This is updated content");

    Linear.updateDocument = originalUpdateDocument;
  });

  it("creates and updates a milestone", async () => {
    const createInput = {
      name: "Test Milestone",
      targetDate: "2023-12-31",
      description: "Test description",
      projectId: "project-1",
    };

    const mockCreatedMilestone = {
      ...createInput,
      id: "milestone-1",
    } as unknown as ProjectMilestone;

    const originalCreateMilestone = Linear.createMilestone;
    Linear.createMilestone = mock(() => Promise.resolve(mockCreatedMilestone));

    const createdMilestone = await Linear.createMilestone(createInput);
    expect(createdMilestone).toEqual(mockCreatedMilestone);

    const updateInput = {
      milestoneId: "milestone-1",
      name: "Updated Milestone",
      targetDate: "2024-01-31",
      description: "Updated description",
    };

    const mockUpdatedMilestone = {
      ...mockCreatedMilestone,
      ...updateInput,
    } as unknown as ProjectMilestone;

    const originalUpdateMilestone = Linear.updateMilestone;
    Linear.updateMilestone = mock(() => Promise.resolve(mockUpdatedMilestone));

    const updatedMilestone = await Linear.updateMilestone(updateInput);
    expect(updatedMilestone).toEqual(mockUpdatedMilestone);

    Linear.createMilestone = originalCreateMilestone;
    Linear.updateMilestone = originalUpdateMilestone;
  });

  it("creates and updates a project update", async () => {
    const createInput = {
      projectId: "project-1",
      body: "Initial project update",
      health: "offTrack" as ProjectUpdateHealthType,
    };

    const mockCreatedUpdate: ProjectUpdate = {
      id: "update-1",
      ...createInput,
      createdAt: new Date(),
    } as unknown as ProjectUpdate;

    const originalCreateProjectUpdate = Linear.createProjectUpdate;
    Linear.createProjectUpdate = mock(() =>
      Promise.resolve(mockCreatedUpdate as ProjectUpdate),
    );

    const createdUpdate = await Linear.createProjectUpdate(createInput);
    expect(createdUpdate).toEqual(mockCreatedUpdate);

    const updateInput = {
      projectUpdateId: "update-1",
      body: "Updated project update",
      health: "onTrack" as ProjectUpdateHealthType,
    };

    const mockUpdatedUpdate = {
      ...mockCreatedUpdate,
      ...updateInput,
      updatedAt: new Date(),
    } as unknown as ProjectUpdate;

    const originalUpdateProjectUpdate = Linear.updateProjectUpdate;
    Linear.updateProjectUpdate = mock(() =>
      Promise.resolve(mockUpdatedUpdate as unknown as ProjectUpdate),
    );

    const updatedUpdate = await Linear.updateProjectUpdate(updateInput);
    expect(updatedUpdate).toEqual(mockUpdatedUpdate);

    Linear.createProjectUpdate = originalCreateProjectUpdate;
    Linear.updateProjectUpdate = originalUpdateProjectUpdate;
  });

  it("gets project updates", async () => {
    const mockedProject = Promise.resolve({
      id: "project-1",
      name: "Test Project",
      description: "This is a test project",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Project);

    const mockProjectUpdates: Partial<ProjectUpdate>[] = [
      { id: "update-1", project: mockedProject, body: "Update 1" },
      { id: "update-2", project: mockedProject, body: "Update 2" },
    ];

    const originalGetProjectUpdates = Linear.getProjectUpdates;
    Linear.getProjectUpdates = mock(() =>
      Promise.resolve(mockProjectUpdates as ProjectUpdate[]),
    );

    const projectUpdates = await Linear.getProjectUpdates("project-1");
    expect(projectUpdates).toHaveLength(2);
    expect(projectUpdates[0].id).toBe("update-1");
    expect(projectUpdates[1].id).toBe("update-2");

    Linear.getProjectUpdates = originalGetProjectUpdates;
  });

  it("creates and updates a comment", async () => {
    const createInput = {
      body: "Test comment",
      issueId: "issue-1",
    };

    const mockCreatedComment: Comment = {
      id: "comment-1",
      ...createInput,
    } as unknown as Comment;

    const originalCreateComment = Linear.createComment;
    Linear.createComment = mock(() =>
      Promise.resolve(mockCreatedComment as Comment),
    );

    const createdComment = await Linear.createComment(createInput);
    expect(createdComment).toEqual(mockCreatedComment);

    const updateInput = {
      id: "comment-1",
      body: "Updated comment",
    };

    const mockUpdatedComment = {
      ...mockCreatedComment,
      ...updateInput,
      updatedAt: new Date(),
    } as unknown as Comment;

    const originalUpdateComment = Linear.updateComment;
    Linear.updateComment = mock(() =>
      Promise.resolve(mockUpdatedComment as Comment),
    );

    const updatedComment = await Linear.updateComment(updateInput);
    expect(updatedComment).toEqual(mockUpdatedComment);

    Linear.createComment = originalCreateComment;
    Linear.updateComment = originalUpdateComment;
  });

  it("adds and removes a label from an issue", async () => {
    const mockIssue: Partial<Issue> = {
      id: "issue-1",
      title: "Test Issue",
      labelIds: ["label-1"],
    };

    let currentLabelIds = [...mockIssue.labelIds!];

    const originalAddLabelToIssue = Linear.addLabelToIssue;
    const originalRemoveLabelFromIssue = Linear.removeLabelFromIssue;

    // Mock addLabelToIssue
    Linear.addLabelToIssue = mock((issueId: string, labelId: string) =>
      Promise.resolve({
        ...mockIssue,
        labelIds: [...currentLabelIds, labelId],
      } as Issue),
    );

    // Mock removeLabelFromIssue
    Linear.removeLabelFromIssue = mock((issueId: string, labelId: string) =>
      Promise.resolve({
        ...mockIssue,
        labelIds: currentLabelIds.filter((id) => id !== labelId),
      } as Issue),
    );

    // Test adding a label
    const issueWithAddedLabel = await Linear.addLabelToIssue(
      "issue-1",
      "label-2",
    );
    expect(issueWithAddedLabel!.labelIds).toEqual(["label-1", "label-2"]);
    currentLabelIds = issueWithAddedLabel!.labelIds;

    // Test removing a label
    const issueWithRemovedLabel = await Linear.removeLabelFromIssue(
      "issue-1",
      "label-1",
    );
    expect(issueWithRemovedLabel!.labelIds).toEqual(["label-2"]);

    // Restore original methods
    Linear.addLabelToIssue = originalAddLabelToIssue;
    Linear.removeLabelFromIssue = originalRemoveLabelFromIssue;
  });

  it("gets labels", async () => {
    const mockLabels: Partial<IssueLabel>[] = [
      { id: "label-1", name: "Bug" },
      { id: "label-2", name: "Feature" },
    ];

    const originalGetLabels = Linear.getLabels;
    Linear.getLabels = mock(() => mockLabels as IssueLabel[]);

    const labels = Linear.getLabels();
    expect(labels).toHaveLength(2);
    expect(labels[0].name).toBe("Bug");
    expect(labels[1].name).toBe("Feature");

    Linear.getLabels = originalGetLabels;
  });

  it("gets organization members", async () => {
    const mockMembers: Partial<User>[] = [
      { id: "user-1", name: "User 1" },
      { id: "user-2", name: "User 2" },
    ];

    const originalGetOrganizationMembers = Linear.getOrganizationMembers;
    Linear.getOrganizationMembers = mock(() => mockMembers as User[]);

    const members = Linear.getOrganizationMembers();
    expect(members).toHaveLength(2);
    expect(members[0].name).toBe("User 1");
    expect(members[1].name).toBe("User 2");

    Linear.getOrganizationMembers = originalGetOrganizationMembers;
  });

  it("updates a project", async () => {
    const projectId = "project-1";
    const updateInput = {
      projectId: projectId,
      name: "Updated Project Name",
      description: "Updated project description",
      leadId: "user-2",
      memberIds: ["user-2", "user-3"],
      priority: 2,
      startDate: "2023-06-01",
      targetDate: "2023-12-31",
      statusId: "status-2",
    };

    const mockTeam = { id: "team-1" } as Team;
    const mockUpdatedProject: Partial<Project> = {
      id: projectId,
      ...updateInput,
      updatedAt: new Date(),
    };

    const mockProjectMilestones = {
      nodes: [
        { id: "milestone-1", name: "Milestone 1" },
        { id: "milestone-2", name: "Milestone 2" },
      ],
    } as unknown as ProjectMilestoneConnection;

    const originalGetTeam = Linear.getTeam;
    const originalUpdateProject = Linear.updateProject;

    Linear.getTeam = mock(() => Promise.resolve(mockTeam));
    Linear.updateProject = mock(() =>
      Promise.resolve({
        success: true,
        project: {
          ...mockUpdatedProject,
          projectMilestones: mockProjectMilestones,
        },
        lastSyncId: 0,
      }),
    );

    const result = await Linear.updateProject(updateInput);

    expect(result.success).toBe(true);
    expect(result.project).toBeDefined();
    expect(result.project!.id).toBe(projectId);
    expect(result.project!.name).toBe(updateInput.name);
    expect(result.project!.description).toBe(updateInput.description);
    expect(result.project!.priority).toBe(updateInput.priority);
    expect(result.project!.startDate).toBe(updateInput.startDate);
    expect(result.project!.targetDate).toBe(updateInput.targetDate);

    expect(result.project.projectMilestones).toBeDefined();
    expect(result.project.projectMilestones!.nodes).toHaveLength(2);
    expect(result.project.projectMilestones!.nodes[0].name).toBe("Milestone 1");
    expect(result.project.projectMilestones!.nodes[1].name).toBe("Milestone 2");

    Linear.getTeam = originalGetTeam;
    Linear.updateProject = originalUpdateProject;
  });
});
