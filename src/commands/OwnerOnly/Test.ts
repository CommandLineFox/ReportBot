import Command from "@command/Command";
import { OwnerOnly } from "~/Groups";
import CommandEvent from "@command/CommandEvent";

export default class Test extends Command {
    constructor() {
        super({ name: "Test", triggers: ["test"], description: "Test command thing", group: OwnerOnly });
    }

    async run(event: CommandEvent) {
        const database = event.client.database;

        const staff = await database?.guilds.findOne({ config: { staff: [..."705152765059530772"] } });
        console.log(staff);
    }
}