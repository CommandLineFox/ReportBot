import Command from "@command/Command";
import { Configuration } from "~/Groups";
import CommandEvent from "@command/CommandEvent";

export default class Config extends Command {
    constructor() {
        super({ name: "Config", triggers: ["config", "cfg"], description: "", group: Configuration });
    }

    async run(_event: CommandEvent) {
        try {
            
        }
        catch (err) {
            console.log(err);
        }
    }
}