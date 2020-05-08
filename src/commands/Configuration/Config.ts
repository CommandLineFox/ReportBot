import Command from "@command/Command";
import { Configuration } from "~/Groups";
import CommandEvent from "@command/CommandEvent";
import ArgumentHandler from "~/command/ArgumentHandler";

export default class Config extends Command {
    constructor() {
        super({ name: "Config", triggers: ["config", "cfg"], description: "", group: Configuration });
    }

    async run(event: CommandEvent) {
        try {
            const database = event.client.database;
            const guild = await database?.guilds.findOne({ id: event.guild.id });

            const args = await ArgumentHandler.getArguments(event, event.argument, "string", "string");
            if (!args) {
                event.reply("invalid arguments.");
                return;
            }

            const [sub, argument] = args;

            switch (sub) {
                case "staff": {
                    const subargument = await ArgumentHandler.getArguments(event, argument, "string", "string");
                    if (!subargument) {
                        event.reply("invalid arguments.");
                        return;
                    }

                    const [sub2, value] = subargument;

                    switch (sub2) {
                        case "add": {
                            const id = await event.guild.roles.cache.find(role => role.name.toLowerCase() === value.toLowerCase())?.id;
                            if (id && !guild?.config.roles?.staff!.includes(id)) {
                                guild?.config.roles?.staff?.push(value);
                            }
                            else if (id && guild?.config.roles?.staff!.includes(id)) {
                                event.reply("that role is already a staff role.")
                            }
                        }
                        case "remove": {
                            const id = await event.guild.roles.cache.find(role => role.name.toLowerCase() === value)?.id;
                            if (!id) {
                                event.reply("That role isn't a staff role");
                            }
                            else if (id && guild?.config.roles?.staff!.includes(id)) {
                                guild?.config.roles!.staff = guild?.config.roles?.staff!.filter(role => role !== id)
                            }
                        }
                        default: {
                            event.reply("valid subcommands are add and remove.");
                        }
                    }
                }
                case "submitchannel": {
                    const subargument = await ArgumentHandler.getArguments(event, argument, "string", "string");
                    if (!subargument) {
                        event.reply("invalid arguments.");
                        return;
                    }

                    const [sub2, value] = subargument;

                    switch (sub2) {
                        case "set": {
                            const id = await event.guild.channels.cache.get(value)!.id;
                            if (id && guild?.config.channels?.submitted === id) {
                                guild?.config.channels!.submitted = value;
                            }
                            else if (id && guild?.config.channels!.submitted === value) {
                                event.reply("that channel is already selected.");
                            }
                        }
                        case "remove": {
                            guild?.config.channels!.submitted = "";
                        }
                    }
                }
                case "handledchannel": {
                    const subargument = await ArgumentHandler.getArguments(event, argument, "string", "string");
                    if (!subargument) {
                        event.reply("invalid arguments.");
                        return;
                    }

                    const [sub2, value] = subargument;

                    switch (sub2) {
                        case "set": {
                            const id = event.guild.channels.cache.get(value)!.id;
                            if (id && guild?.config.channels?.handled === id) {
                                guild?.config.channels!.handled = value;
                            }
                            else if (id && guild?.config.channels!.handled === value) {
                                event.reply("that channel is already selected.");
                            }
                        }
                        case "remove": {
                            guild?.config.channels!.handled = "";
                        }
                    }
                }
                case "prefix": {
                    const prefix = argument[1];
                    if (guild?.config!.prefix === prefix) {
                        event.reply("that prefix is already set.");
                    }
                    else {
                        guild?.config!.prefix = prefix;
                    }
                }
                default: {
                    event.reply("valid subcommands are submitchannel, handledchannel and prefix.");
                }
            }
        }
        catch (err) {
            console.log(err);
        }
    }
}