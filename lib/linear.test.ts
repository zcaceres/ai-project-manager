import { beforeEach, describe, it, expect, mock } from "bun:test";
import Linear from "../lib/linear";
import { GetProjectStatuses } from "./tools/projects";
import type { ProjectStatus } from "@linear/sdk";

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

  it("creates a issue", async () => {
    const issueInput = {
      title: "Test Issue",
      description: "This is a test issue",
    };

    const createdIssue = await Linear.createIssue(issueInput);
    const issue = await createdIssue.issue;

    expect(issue).toBeDefined();
    expect(issue!.title).toBe("Test Issue");
    expect(issue!.description).toBe("This is a test issue");
  });

  it("gets all issues", async () => {
    const issues = await Linear.getAllIssues();
    expect(issues).toBeDefined();
    expect(issues.length).toBeGreaterThan(0);
  });

  it("gets all workflow states", async () => {
    const workflowStates = Linear.getIssueStatuses();
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

  it("assigns a leadId and memberIds", async () => {
    let issues = await Linear.getAllIssues();
    const user = await Linear.getCurrentUser();

    await Linear.updateIssue({
      issueId: issues[0].id,
      assigneeId: user.id,
    });

    await Linear.hydrate();

    issues = await Linear.getAllIssues();
    const updatedIssue = issues.find((issue) => issue.id === issues[0].id)!;
    let assignee = await updatedIssue.assignee;
    expect(assignee!.id).toBe(user.id);
  });

  // describe("GetProjectStatuses tool", () => {
  //   it("fetches project statuses correctly", async () => {
  //     // Mock the Linear.getProjectStatuses method
  //     const mockProjectStatuses = [
  //       { id: "1", name: "In Progress" },
  //       { id: "2", name: "Completed" },
  //     ];
  //     const originalGetProjectStatuses = Linear.getProjectStatuses;
  //     Linear.getProjectStatuses = mock(
  //       () => mockProjectStatuses as ProjectStatus[],
  //     );

  //     // Call the tool's function
  //     const result = GetProjectStatuses.fn();

  //     // Parse the result (it should be a JSON string)
  //     const parsedResult = JSON.parse(result as string);

  //     // Assertions
  //     expect(parsedResult).toEqual(mockProjectStatuses);
  //     expect(Linear.getProjectStatuses).toHaveBeenCalledTimes(1);

  //     // Restore the original method
  //     Linear.getProjectStatuses = originalGetProjectStatuses;
  //   });

  //   it("handles errors gracefully", async () => {
  //     // Mock the Linear.getProjectStatuses method to throw an error
  //     const originalGetProjectStatuses = Linear.getProjectStatuses;
  //     Linear.getProjectStatuses = mock(() => {
  //       throw new Error("Test error");
  //     });

  //     // Call the tool's function
  //     const result = GetProjectStatuses.fn();

  //     // Assertions
  //     expect(result).toBe("Error: Test error");
  //     expect(Linear.getProjectStatuses).toHaveBeenCalledTimes(1);

  //     // Restore the original method
  //     Linear.getProjectStatuses = originalGetProjectStatuses;
  //   });
  // });
});
