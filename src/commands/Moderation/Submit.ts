import Command from "@command/Command";
import { Moderation } from "~/Groups";
import CommandEvent from "@command/CommandEvent";
import { SubmitReport } from "~/utils/Helpers";

export default class Submit extends Command {
    constructor () {
        super({name: "Submit", triggers: ["submit", "report"], description: "Generates a report on a specified user", group: Moderation});
    }

    async run(event: CommandEvent) {
        try {
            const message = event.message;
            const argument = event.argument;
            const database = event.client.database;
            
            SubmitReport(argument, message, database!);
        }
        catch (err) {
            console.log(err);
        }
    }
}