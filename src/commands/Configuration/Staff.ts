import Command from "@command/Command";
import { Configuration } from "~/Groups";
import CommandEvent from "@command/CommandEvent";
import ArgumentHandler from "~/command/ArgumentHandler";

export default class Config extends Command {
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
                    /*const id = await event.guild.roles.cache.find(role => role.name.toLowerCase() === argument.toLowerCase())?.id;

                    if (id && !guild?.config.roles?.staff!.includes(id)) {
                        guild?.config.roles?.staff?.push(argument);
                    }
                    else if (id && guild?.config.roles?.staff!.includes(id)) {
                        event.reply("that role is already a staff role.");
                    }*/
                }
                case "remove": {
                    /*const id = await event.guild.roles.cache.find(role => role.name.toLowerCase() === argument.toLowerCase())?.id;
                    if (!id) {
                        event.reply("That role isn't a staff role");
                    }
                    else if (id && guild?.config.roles?.staff!.includes(id)) {
                        guild?.config.roles!.staff = guild?.config.roles?.staff!.filter(role => role !== id)
                    }*/
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