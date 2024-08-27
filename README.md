# linear-ai

An AI Agent that does project management work in Linear (linear.app).

Built on top of Anthropic's Claude family of models. This agent is a CLI tool that can create new tickets, update ticket status, and interact with Linear's API through a simple conversational interface.

## Features

- Talk to an AI PM and it will:
  - **Create New Tickets**: The agent can create new tickets in Linear with specified titles, descriptions, and states.
  - **Update Existing Ticket**: Changes in the ticket and to the status of the ticket.
  - **Write PRDS**
     - Create Product Requirement Documents (PRDs) within Linear projects.
  - **Summarize Projects**: Summarize the current status of all active projects in the portfolio.
  - **Summarize Timelines**: Create a high-level overview of the product development timeline based on start and due dates of projects.

## Example Natural Language Commands
1. "Create a detailed project plan for our new mobile app."
2. "Generate a comprehensive PRD for our upcoming e-commerce platform."
3. "Update the status of all in-progress tasks to reflect current progress."
4. "Draft clear and actionable tickets for each feature in our roadmap."
5. "Review and refine the descriptions of our existing issues for clarity."
8. "Assign appropriate statuses to newly created tasks."
9. "Summarize the current status of all active projects in our portfolio."
10. "Create a high-level overview of our product development timeline."


## Installation

To install dependencies:

```bash
bun install
```

## Usage

To run the agent:

```bash
bun run start
```

This will start Linear Agent in CLI mode. Talk to it and it'll do work for you.

Make sure to set up your Linear API key as an environment variable before running the agent.

This project was created using `bun init` in bun v1.1.24. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

Built with [easy-agent](https://github.com/zcaceres/easy-agent).
