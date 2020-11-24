import CommandEvent from "@command/CommandEvent";
import { Guild } from "@models/Guild";
import { Database } from "@utils/Database";
import { DatabaseCheckOption, DisplayData } from "@utils/Types";
import { MessageEmbed } from "discord.js";

export async function databaseCheck(database: Database, guild: Guild, option: DatabaseCheckOption) {
    switch (option.toLowerCase()) {
        case "roles": {
            if (!guild.config.roles) {
                await database.guilds.updateOne({ id: guild.id }, { "$set": { "config.roles": {} } });
            }
            break;
        }

        case "staff": {
            if (!guild.config.roles) {
                await database.guilds.updateOne({ id: guild.id }, { "$set": { "config.roles": { "staff": [] } } });
            }

            else if (!guild.config.roles!.staff) {
                await database.guilds.updateOne({ id: guild.id }, { "$set": { "config.roles.staff": [] } });
            }
            break;
        }

        case "channels": {
            if (!guild.config.channels) {
                await database.guilds.updateOne({ id: guild.id }, { "$set": { "config.channels": {} } });
            }
            break;
        }
    }
}

export async function displayData(event: CommandEvent, guild: Guild, type: DisplayData, specific?: boolean) {
    const client = event.client;
    const database = client.database;
    if (!specific) {
        switch (type.toLowerCase()) {
            case "prefix": {
                return guild?.config.prefix || client.config.prefix;
            }

            case "staff": {
                const mods = guild?.config.roles?.staff;
                if (!mods || mods.length === 0) {
                    return "There is no moderator roles.";
                }

                let list = "";
                mods.forEach(async (mod) => {
                    const role = event.guild.roles.cache.get(mod);
                    if (!role) {
                        await database?.guilds.updateOne({ id: guild.id }, { "$pull": { "config.roles.moderator": mod } });
                    }
                    else {
                        list += `${role.name}\n`;
                    }
                })

                return list;
            }

            case "roles": {

            }
        }
    }
    else {
        switch (type.toLowerCase()) {
            case "prefix": {
                event.send(`The prefix is currently set to \`${guild?.config.prefix || client.config.prefix}\``);
                break;
            }

            case "staff": {
                const mods = guild?.config.roles?.staff;
                if (!mods || mods.length === 0) {
                    event.send("There is no moderator roles.");
                    return;
                }

                const embed = new MessageEmbed()
                    .setTitle("The following roles are moderator roles:")
                    .setColor("#61e096")
                    .setFooter(`Requested by ${event.author.tag}`, event.author.displayAvatarURL());

                let list = "";
                mods.forEach(async (mod) => {
                    const role = event.guild.roles.cache.get(mod);
                    if (!role) {
                        await database?.guilds.updateOne({ id: guild.id }, { "$pull": { "config.roles.staff": mod } });
                    }
                    else {
                        list += `${role.name}\n`;
                    }
                })

                embed.setDescription(list);
                event.send({ embed: embed });
                break;
            }

        }
    }
    return;
}