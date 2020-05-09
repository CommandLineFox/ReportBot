import Command from "@command/Command";
import { Moderation } from "~/Groups";
import CommandEvent from "@command/CommandEvent";
import { SolveReport } from "~/utils/Helpers";

export default class Solve extends Command {
    constructor() {
        super({ name: "Solve", triggers: ["approve", "solve"], description: "Generates a report on a specified user", group: Moderation });
    }

    async run(event: CommandEvent) {
        try {
            const message = event.message;
            const argument = event.argument;
            const database = event.client.database;

            SolveReport(argument, message, database!);
        }
        catch (err) {
            console.log(err);
        }
    }
}