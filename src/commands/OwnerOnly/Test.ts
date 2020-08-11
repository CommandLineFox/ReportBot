import Command from "@command/Command";
import { OwnerOnly } from "~/Groups";
import CommandEvent from "@command/CommandEvent";

export default class Test extends Command {
    constructor() {
        super({ name: "Test", triggers: ["test"], description: "Test command thing", group: OwnerOnly });
    }

    async run(_event: CommandEvent) {
        try {
            
        }
        catch (err) {
            console.log(err);
        }
    }
}