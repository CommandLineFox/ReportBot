import Command from "@command/Command";
import {Administration} from "~/Groups";
import CommandEvent from "@command/CommandEvent";
import {Guild} from "@models/Guild";
import {MessageEmbed} from "discord.js";
import {databaseCheck, displayData, splitArguments} from "@utils/Utils";

export default class Config extends Command {
    public constructor() {
        super({name: "Config", triggers: ["config", "cfg", "setup"], description: "Configures various settings for the guild", group: Administration});
    }

    public async run(event: CommandEvent): Promise<void> {
        const client = event.client;
        const database = client.database;

        const guild = await client.getGuildFromDatabase(database!, event.guild.id);
        const [subcommand, option, args] = splitArguments(event.argument, 3);

        if (!subcommand) {
            await displayAllSettings(event, guild!);
            return;
        }

        switch (subcommand.toLowerCase()) {
            case "prefix": {
                await prefixSettings(event, option, args, guild!);
                break;
            }

            case "staff": {
                await moderatorSettings(event, option, args, guild!);
                break;
            }

            case "roles": {
                await roleSettings(event, option, args, guild!);
                break;
            }
        }
    }
}

async function prefixSettings(event: CommandEvent, option: string, args: string, guild: Guild) {
    const client = event.client;
    const database = client.database;

    if (!option) {
        await displayData(event, guild, "prefix", true);
        return;
    }

    switch (option.toLowerCase()) {
        case "set": {
            if (args.length > 5) {
                await event.send("The prefix can be up to 5 characters.");
                break;
            }

            await database?.guilds.updateOne({id: guild?.id}, {"$set": {"config.prefix": args}});
            await event.send(`The prefix has been set to \`${args}\``);
            break;
        }

        case "reset": {
            await database?.guilds.updateOne({id: guild?.id}, {"$unset": {"config.prefix": ""}});
            await event.send(`The prefix has been set to \`${client.config.prefix}\``);
            break;
        }
    }
}

async function moderatorSettings(event: CommandEvent, option: string, args: string, guild: Guild) {
    const database = event.client.database;
    await databaseCheck(database!, guild, "staff");

    if (!option) {
        await displayData(event, guild, "staff", true);
        return;
    }

    const staff = args;
    if (!staff) {
        await event.send("You need to specify a role.");
        return;
    }

    const role = event.guild.roles.cache.find(role => role.id === staff || role.name === staff || `<@&${role.id}>` === staff);
    if (!role) {
        await event.send("Couldn't find the role you're looking for.");
        return;
    }

    switch (option.toLowerCase()) {
        case "add": {
            if (guild.config.roles?.staff?.includes(role.id)) {
                await event.send("The specified role is already a staff role.");
                break;
            }

            await database?.guilds.updateOne({id: guild.id}, {"$push": {"config.roles.staff": role.id}});
            await event.send(`Added \`${role.name}\` as a staff role.`);
            break;
        }
        case "remove": {
            if (!guild.config.roles?.staff?.includes(role.id)) {
                await event.send("The specified role isn't a staff role.");
                break;
            }

            await database?.guilds.updateOne({id: guild.id}, {"$pull": {"config.roles.staff": role.id}});
            await event.send(`\`${role.name}\` is no longer a staff role.`);
            break;
        }
    }
}

async function roleSettings(event: CommandEvent, option: string, args: string, guild: Guild) {
    const database = event.client.database;
    await databaseCheck(database!, guild, "roles");

    if (!option) {
        await displayData(event, guild, "roles", true);
        return;
    }

    switch (option.toLowerCase()) {
        case "set": {
            if (args === "") {
                return;
            }
            break;
        }

        case "remove": {
            break;
        }
    }
}

async function displayAllSettings(event: CommandEvent, guild: Guild) {
    const embed = new MessageEmbed()
        .setTitle("The current settings for this server:")
        .addField("Prefix", await displayData(event, guild, "prefix"), true)
        .addField("Moderators", await displayData(event, guild, "staff"), true)
        .addField("Suggestions", await displayData(event, guild, "suggestions"), true)
        .addField("Reports", await displayData(event, guild, "report"), true)
        .addField("MVP", await displayData(event, guild, "mvp"), true)
        .addField("VIP", await displayData(event, guild, "vip"), true)
        .setColor("#61e096")
        .setFooter(`Requested by ${event.author.tag}`, event.author.displayAvatarURL());

    await event.send({embed: embed});
}
