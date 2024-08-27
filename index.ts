import { EasyAgentCLI } from "easy-agent";
import ProjectManager from "./lib/project-manager";

// Take in the request to make a ticket (prompt)
// Write the ticket in the right format (prompt)
// Create the new ticket in Linear via the SDK (tool use)

EasyAgentCLI.start([ProjectManager]);
