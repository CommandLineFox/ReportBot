import Command from "@command/Command";
import { Moderation } from "~/Groups";
import CommandEvent from "@command/CommandEvent";

export default class Solve extends Command {
    constructor() {
        super({ name: "Solve", triggers: ["approve", "solve"], description: "Generates a report on a specified user", group: Moderation });
    }

    async run(_event: CommandEvent) {
        try {
            
        }
        catch (err) {
            console.log(err);
        }
    }
}