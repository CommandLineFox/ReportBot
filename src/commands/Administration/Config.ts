import Command from "@command/Command";
import { Administration } from "~/Groups";
import CommandEvent from "@command/CommandEvent";
import { Guild } from "@models/Guild";
import { MessageEmbed } from "discord.js";
import { databaseCheck, displayData } from "@utils/Utils";

export default class Config extends Command {
    constructor() {
        super({ name: "Config", triggers: ["config", "cfg", "setup"], description: "Configures various settings for the guild", group: Administration });
    }

    async run(event: CommandEvent) {
        const client = event.client;
        const database = client.database;

        let guild = await database!.guilds.findOne({ id: event.guild.id });
        if (!guild) {
            const newguild = new Guild({ id: event.guild.id });
            await database!.guilds.insertOne(newguild);
            guild = await database!.guilds.findOne({ id: event.guild.id });
        }

        const [subcommand, option, args] = event.argument.split(/\s+/);

        if (!subcommand) {
            displayAllSettings(event, guild!)
        }

        switch (subcommand.toLowerCase()) {
            case "prefix": {
                prefixSettings(event, option, args, guild!);
                break;
            }

            case "staff": {
                moderatorSettings(event, option, args, guild!);
                break;
            }

            case "roles": {
                roleSettings(event, option, args, guild!);
            }
        }
    }
}

async function prefixSettings(event: CommandEvent, option: string, args: string, guild: Guild) {
    const client = event.client;
    const database = client.database;

    if (!option) {
        displayData(event, guild, "prefix", true);
        return;
    }

    switch (option.toLowerCase()) {
        case "set": {
            if (args.length > 5) {
                event.send("The prefix can be up to 5 characters.");
                break;
            }

            await database?.guilds.updateOne({ id: guild?.id }, { "$set": { "config.prefix": args } });
            event.send(`The prefix has been set to \`${args}\``);
            break;
        }

        case "reset": {
            await database?.guilds.updateOne({ id: guild?.id }, { "$unset": { "config.prefix": "" } });
            event.send(`The prefix has been set to \`${client.config.prefix}\``);
            break;
        }
    }
}

async function moderatorSettings(event: CommandEvent, option: string, args: string, guild: Guild) {
    const database = event.client.database;
    databaseCheck(database!, guild, "staff");

    if (!option) {
        displayData(event, guild, "staff", true);
        return;
    }

    const staff = args;
    if (!staff) {
        event.send("You need to specify a role.");
        return;
    }

    const role = event.guild.roles.cache.find(role => role.id === staff || role.name === staff || `<@&${role.id}>` === staff);
    if (!role) {
        event.send("Couldn't find the role you're looking for.");
        return;
    }

    switch (option.toLowerCase()) {
        case "add": {
            if (guild.config.roles?.staff?.includes(role.id)) {
                event.send("The specified role is already a staff role.");
                break;
            }

            await database?.guilds.updateOne({ id: guild.id }, { "$push": { "config.roles.staff": role.id } });
            event.send(`Added \`${role.name}\` as a staff role.`);
            break;
        }
        case "remove": {
            if (!guild.config.roles?.staff?.includes(role.id)) {
                event.send("The specified role isn't a staff role.");
                break;
            }

            await database?.guilds.updateOne({ id: guild.id }, { "$pull": { "config.roles.staff": role.id } });
            event.send(`\`${role.name}\` is no longer a staff role.`);
            break;
        }
    }
}

async function roleSettings(event: CommandEvent, option: string, args: string, guild: Guild) {
    const database = event.client.database;
    databaseCheck(database!, guild, "roles");

    if (!option) {
        displayData(event, guild, "roles", true);
        return;
    }

    switch (option.toLowerCase()) {
        default: {
            switch (args) {

            }
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

    event.send({ embed: embed });
}