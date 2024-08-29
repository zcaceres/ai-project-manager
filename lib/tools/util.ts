import Tool from "../../../easy-agent/dist/lib/tool";

export const GetCurrentDateTime = Tool.create({
  name: "get_current_date_time",
  description: "Returns a string describing the current date and time",
  inputs: [],
  fn: () => {
    try {
      const now = new Date();
      const dateTimeString = now.toLocaleString("en-US", {
        dateStyle: "full",
        timeStyle: "long",
        timeZone: "UTC",
      });
      return `The current date and time (UTC) is: ${dateTimeString}`;
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
  },
});
