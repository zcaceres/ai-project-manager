# AI Project Manager

AI Project Manager is an AI Agent that does tasks in Linear for you.

## Features

Type in natural language to an AI Project Manager.

The AI PM will understand your commands and execute them in Linear.

The AI PM can do the following:
- Create projects and write documents like PRDs
- Set milestones and update statuses
- Assign tasks and manage team members
- Create and assign issues
- Label issues
- Generate project updates for stakeholders

## Installation

1. Clone the repository:
```
git clone https://github.com/zcaceres/ai-project-manager.git
```

2. Navigate to the project directory:
```
cd ai-project-manager
```

3. Install dependencies:
```
bun install
```

4. Set up your Linear API key as an environment variable:
```
export LINEAR_API_KEY=your_api_key_here
```

## Usage

To start the AI Project Manager:

```
bun run start
```

This will launch the CLI interface where you can interact with the AI Project Manager using natural language commands. The agent will then take actions within Linear.app based on your input.

### Example Commands

- "Create a detailed project plan for our new mobile app."
- "Generate a comprehensive PRD for our upcoming e-commerce platform."
- "Update the status of all in-progress tasks to reflect current progress."
- "Create a milestone for the beta release of our product."
- "Assign John Doe as the lead for the marketing campaign project."

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built live on Twitch by [Zach C](https://www.twitch.tv/zachdotdev)
- Built with [easy-agent](https://github.com/zcaceres/easy-agent)
- Special thanks to the Linear.app team for their excellent API and documentation

## TODOs

- Ingest evidence from other sources to inform the project workstream
  - qualitative and quantitative data
    - user interviews
    - surveys
    - user testing
    - session replays
    - metrics
    - Fullstory
    - Metabase
    - Google Analytics
    - Posthog
- Roadmap / Epics management
