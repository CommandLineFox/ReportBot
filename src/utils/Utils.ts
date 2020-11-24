import CommandEvent from "@command/CommandEvent";
import {Guild} from "@models/Guild";
import {Database} from "@utils/Database";
import {DatabaseCheckOption, DisplayData} from "@utils/Types";
import {MessageEmbed} from "discord.js";

export async function databaseCheck(database: Database, guild: Guild, option: DatabaseCheckOption): Promise<void> {
    switch (option.toLowerCase()) {
        case "roles": {
            if (!guild.config.roles) {
                await database.guilds.updateOne({id: guild.id}, {"$set": {"config.roles": {}}});
            }
            break;
        }

        case "staff": {
            if (!guild.config.roles) {
                await database.guilds.updateOne({id: guild.id}, {"$set": {"config.roles": {"staff": []}}});
            } else if (!guild.config.roles!.staff) {
                await database.guilds.updateOne({id: guild.id}, {"$set": {"config.roles.staff": []}});
            }
            break;
        }

        case "channels": {
            if (!guild.config.channels) {
                await database.guilds.updateOne({id: guild.id}, {"$set": {"config.channels": {}}});
            }
            break;
        }
    }
}

export async function displayData(event: CommandEvent, guild: Guild, type: DisplayData, specific?: boolean): Promise<string | undefined> {
    const client = event.client;
    const database = client.database;
    if (!specific) {
        switch (type.toLowerCase()) {
            case "prefix": {
                return guild?.config.prefix ?? client.config.prefix;
            }

            case "staff": {
                const mods = guild?.config.roles?.staff;
                if (!mods || mods.length === 0) {
                    return "There is no moderator roles.";
                }

                let list = "";
                for (const mod of mods) {
                    const role = event.guild.roles.cache.get(mod);
                    if (!role) {
                        await database?.guilds.updateOne({id: guild.id}, {"$pull": {"config.roles.moderator": mod}});
                    } else {
                        list += `${role.name}\n`;
                    }
                }

                return list;
            }
        }
    } else {
        switch (type.toLowerCase()) {
            case "prefix": {
                await event.send(`The prefix is currently set to \`${guild?.config.prefix ?? client.config.prefix}\``);
                break;
            }

            case "staff": {
                const mods = guild?.config.roles?.staff;
                if (!mods || mods.length === 0) {
                    await event.send("There is no moderator roles.");
                    return;
                }

                const embed = new MessageEmbed()
                    .setTitle("The following roles are moderator roles:")
                    .setColor("#61e096")
                    .setFooter(`Requested by ${event.author.tag}`, event.author.displayAvatarURL());

                let list = "";
                for (const mod of mods) {
                    const role = event.guild.roles.cache.get(mod);
                    if (!role) {
                        await database?.guilds.updateOne({id: guild.id}, {"$pull": {"config.roles.moderator": mod}});
                    } else {
                        list += `${role.name}\n`;
                    }
                }

                embed.setDescription(list);
                await event.send({embed: embed});
                break;
            }

        }
    }
    return;
}

export function splitArguments(argument: string, amount: number): string[] {
    const args = [];
    let element = "";
    let index = 0;

    while (index < argument.length) {
        if (args.length < amount - 1) {
            if (argument[index].match(/\s/)) {
                if (element.trim().length > 0) {
                    args.push(element.trim());
                }

                element = "";
            }
        }
        element += argument[index];
        index++;
    }

    if (element.trim().length > 0) {
        args.push(element.trim());
    }

    return args;
}
