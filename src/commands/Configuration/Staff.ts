import Command from "@command/Command";
import { Configuration } from "~/Groups";
import CommandEvent from "@command/CommandEvent";
import ArgumentHandler from "~/command/ArgumentHandler";

export default class Staff extends Command {
    constructor() {
        super({ name: "Staff", triggers: ["staff"], description: "Add or remove staff roles for the server", group: Configuration });
    }

    async run(event: CommandEvent) {
        try {
            const message = event.message;
            const database = event.client.database;

            const args = await ArgumentHandler.getArguments(event, event.argument, "string", "string");
            if (!args) {
                event.reply("invalid arguments.");
                return;
            }

            const [sub, argument] = args;


            switch (sub) {
                case "add": {
                    await database?.guilds.updateOne({
                        id: message.guild?.id
                    }, {
                        "$push": {
                            staff: {
                                argument
                            }
                        }
                    })
                    console.log("yes");
                    break;
                }
                case "remove": {
                    await database?.guilds.updateOne({
                        id: message.guild?.id
                    }, {
                        "$pull": {
                            staff: {
                                argument
                            }
                        }
                    })
                    console.log("yeeted");
                    break;
                }
                case "list": {
                    const guild = await database?.guilds.findOne({ id: message.guild?.id });
                    guild?.config.roles?.staff;
                    break;
                }
                default: {
                    event.send("valid subcommands are `add` and `remove`.");
                }
            }
        }
        catch (err) {

        }
    }
}