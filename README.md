# linear-ai

An AI Agent that does project management work in Linear (linear.app).

Built on top of Anthropic's Claude family of models. This agent is a CLI tool that can create new tickets, update ticket status, and interact with Linear's API through a simple conversational interface.

## Features

- Talk to an AI PM and it will:
  - **Create New Tickets**: The agent can create new tickets in Linear with specified titles, descriptions, and states.
  - **Update Existing Ticket**: Changes in the ticket and to the status of the ticket.

## Example Natural Language Commands
- "That recent ticket that referred to the bug in our authentication system is fixed. Update the ticket."
- "We're working on a new project to improve test coverage in the backend. Based on this PRD and context from the codebase, create a set of tickets that suggest areas to improve."
- "Project X will be delayed due to unforeseen scope changes. Update the calendar associated with the project and provide an update to everyone who is subscribed to the project's notifications."


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
