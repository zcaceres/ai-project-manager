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
    console.log("created");
    const issue = await createdTicket.issue;
    console.log("issue");

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
});
