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
                if (args !== ["list"]) {
                    event.reply("invalid arguments.");
                }
                return;
            }


            switch (args[0]) {
                case "add": {
                    const role = message.guild?.roles.cache.find(role => role.name.toLowerCase() === args[1].toLowerCase());

                    if (!role) {
                        event.send("Couldn't find the role.");
                        return;
                    }
                    await database?.guilds.updateOne({
                        id: message.guild?.id
                    }, {
                        "$push": {
                            "config.roles.staff": {
                                id: role?.id
                            }
                        }
                    })
                        .then(() => event.send(`${role?.name} is now a staff role.`));
                    break;
                }
                case "remove": {
                    const role = message.guild?.roles.cache.find(role => role.name.toLowerCase() === args[1].toLowerCase());

                    if (!role) {
                        event.send("Couldn't find the role.");
                        return;
                    }

                    await database?.guilds.updateOne({
                        id: message.guild?.id
                    }, {
                        "$pull": {
                            "config.roles.staff": {
                                id: role?.id
                            }
                        }
                    })
                        .then(() => event.send(`${role?.name} is no longer a staff role.`));
                    break;
                }
                case "list": {
                    const guild = await database?.guilds.findOne({ id: message.guild?.id });
                    event.send(guild?.config.roles?.staff!.join(' '));
                    break;
                }
                default: {
                    event.send("valid subcommands are `add`, `remove` and `list`.");
                }
            }
        }
        catch (err) {
            console.log(err);
        }
    }
}