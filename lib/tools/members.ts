import Tool from "../../../easy-agent/dist/lib/tool";
import Linear from "../linear";

export const GetMembers: Tool = Tool.create({
  name: "get_members",
  description: "Retrieves all members of the Linear organization",
  inputs: [],
  fn: async () => {
    try {
      const members = Linear.getOrganizationMembers();
      return JSON.stringify(members);
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
  },
});
