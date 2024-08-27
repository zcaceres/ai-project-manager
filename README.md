# linear-ai

An AI Agent that does project management work in Linear (linear.app).

Built on top of Anthropic's Claude family of models. This agent is a CLI tool that can create new tickets, update ticket status, and interact with Linear's API through a simple conversational interface.

## Features

- Create new tickets for a specified team
- Update ticket status
- Interact with Linear's API through a simplified interface

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

## Talking to the Agent

- "We're working on a new project to improve test coverage in the backend. Based on this PRD and context from the codebase, create a set of tickets that suggest areas to improve."
- "Project X will be delayed due to unforeseen scope changes. Update the calendar associated with the project and provide an update to everyone who is subscribed to the project's notifications."
- "That recent ticket that referred to the bug in our authentication system is fixed. Update the ticket status."
