"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitArguments = exports.displayData = exports.databaseCheck = void 0;
const discord_js_1 = require("discord.js");
async function databaseCheck(database, guild, option) {
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
            else if (!guild.config.roles.staff) {
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
exports.databaseCheck = databaseCheck;
async function displayData(event, guild, type, specific) {
    var _a, _b;
    const client = event.client;
    const database = client.database;
    if (!specific) {
        switch (type.toLowerCase()) {
            case "prefix": {
                return (guild === null || guild === void 0 ? void 0 : guild.config.prefix) || client.config.prefix;
            }
            case "staff": {
                const mods = (_a = guild === null || guild === void 0 ? void 0 : guild.config.roles) === null || _a === void 0 ? void 0 : _a.staff;
                if (!mods || mods.length === 0) {
                    return "There is no moderator roles.";
                }
                let list = "";
                mods.forEach(async (mod) => {
                    const role = event.guild.roles.cache.get(mod);
                    if (!role) {
                        await (database === null || database === void 0 ? void 0 : database.guilds.updateOne({ id: guild.id }, { "$pull": { "config.roles.moderator": mod } }));
                    }
                    else {
                        list += `${role.name}\n`;
                    }
                });
                return list;
            }
        }
    }
    else {
        switch (type.toLowerCase()) {
            case "prefix": {
                event.send(`The prefix is currently set to \`${(guild === null || guild === void 0 ? void 0 : guild.config.prefix) || client.config.prefix}\``);
                break;
            }
            case "staff": {
                const mods = (_b = guild === null || guild === void 0 ? void 0 : guild.config.roles) === null || _b === void 0 ? void 0 : _b.staff;
                if (!mods || mods.length === 0) {
                    event.send("There is no moderator roles.");
                    return;
                }
                const embed = new discord_js_1.MessageEmbed()
                    .setTitle("The following roles are moderator roles:")
                    .setColor("#61e096")
                    .setFooter(`Requested by ${event.author.tag}`, event.author.displayAvatarURL());
                let list = "";
                mods.forEach(async (mod) => {
                    const role = event.guild.roles.cache.get(mod);
                    if (!role) {
                        await (database === null || database === void 0 ? void 0 : database.guilds.updateOne({ id: guild.id }, { "$pull": { "config.roles.staff": mod } }));
                    }
                    else {
                        list += `${role.name}\n`;
                    }
                });
                embed.setDescription(list);
                event.send({ embed: embed });
                break;
            }
        }
    }
    return;
}
exports.displayData = displayData;
function splitArguments(argument, amount) {
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
exports.splitArguments = splitArguments;
//# sourceMappingURL=Utils.js.map