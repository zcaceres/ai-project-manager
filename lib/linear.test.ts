import { beforeEach, describe, it, expect, mock } from "bun:test";
import Linear from "../lib/linear";

describe("Linear module", async () => {
  it("gets the current user", async () => {
    const user = await Linear.getCurrentUser();
    expect(user).toBeDefined();
    expect(user.name).toBe("linear@zach.dev");
    expect(user.email).toBe("linear@zach.dev");
  });

  it("gets a valid team", async () => {
    const team = await Linear.getTeam();

    expect(team).toBeDefined();
    expect(team).toBeDefined();
    expect(team.id).toBeDefined();
    expect(team.name).toEqual("Linear PM");
  });

  it("creates a ticket", async () => {
    const ticketInput = {
      title: "Test Ticket",
      description: "This is a test ticket",
    };

    const createdTicket = await Linear.createTicket(ticketInput);
    const issue = await createdTicket.issue;

    expect(issue).toBeDefined();
    expect(issue!.title).toBe("Test Ticket");
    expect(issue!.description).toBe("This is a test ticket");
  });

  it("gets all issues", async () => {
    const issues = await Linear.getAllIssues();
    expect(issues).toBeDefined();
    expect(issues.length).toBeGreaterThan(0);
  });

  it("gets all workflow states", async () => {
    const workflowStates = Linear.getWorkflowStates();
    expect(workflowStates).toBeDefined();
    expect(workflowStates.length).toBeGreaterThan(0);
    expect(workflowStates.find((state) => state.name === "Todo")!.name).toBe(
      "Todo",
    );
  });

  it("gets all projects", async () => {
    const projects = Linear.getProjects();
    expect(projects).toBeDefined();
    expect(projects.length).toBeGreaterThan(0);
    expect(projects[0].name).toBe("AI Agent Test Project");
  });

  it("creates a document", async () => {
    const projects = Linear.getProjects();
    const documentInput = {
      title: "Test Document",
      content: "This is a test document",
      projectId: projects[0].id,
    };

    const documentCreatedEvent = await Linear.createDocument(documentInput);
    expect(documentCreatedEvent).toBeDefined();
    expect(documentCreatedEvent.success).toEqual(true);
    expect(documentCreatedEvent.document!.title).toBe("Test Document");
    expect(documentCreatedEvent.document!.content).toBe(
      "This is a test document",
    );
  });

  it("gets all documents", async () => {
    const documents = Linear.getDocuments();
    expect(documents).toBeDefined();
    expect(documents.length).toBeGreaterThan(0);
  });
});
