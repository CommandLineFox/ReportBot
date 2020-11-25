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
    var _a, _b, _c, _d;
    const client = event.client;
    const database = client.database;
    if (!specific) {
        switch (type.toLowerCase()) {
            case "prefix": {
                return (_a = guild === null || guild === void 0 ? void 0 : guild.config.prefix) !== null && _a !== void 0 ? _a : client.config.prefix;
            }
            case "staff": {
                const mods = (_b = guild === null || guild === void 0 ? void 0 : guild.config.roles) === null || _b === void 0 ? void 0 : _b.staff;
                if (!mods || mods.length === 0) {
                    return "There is no moderator roles.";
                }
                let list = "";
                for (const mod of mods) {
                    const role = event.guild.roles.cache.get(mod);
                    if (!role) {
                        await (database === null || database === void 0 ? void 0 : database.guilds.updateOne({ id: guild.id }, { "$pull": { "config.roles.moderator": mod } }));
                    }
                    else {
                        list += `${role.name}\n`;
                    }
                }
                return list;
            }
        }
    }
    else {
        switch (type.toLowerCase()) {
            case "prefix": {
                await event.send(`The prefix is currently set to \`${(_c = guild === null || guild === void 0 ? void 0 : guild.config.prefix) !== null && _c !== void 0 ? _c : client.config.prefix}\``);
                break;
            }
            case "staff": {
                const mods = (_d = guild === null || guild === void 0 ? void 0 : guild.config.roles) === null || _d === void 0 ? void 0 : _d.staff;
                if (!mods || mods.length === 0) {
                    await event.send("There is no moderator roles.");
                    return;
                }
                const embed = new discord_js_1.MessageEmbed()
                    .setTitle("The following roles are moderator roles:")
                    .setColor("#61e096")
                    .setFooter(`Requested by ${event.author.tag}`, event.author.displayAvatarURL());
                let list = "";
                for (const mod of mods) {
                    const role = event.guild.roles.cache.get(mod);
                    if (!role) {
                        await (database === null || database === void 0 ? void 0 : database.guilds.updateOne({ id: guild.id }, { "$pull": { "config.roles.moderator": mod } }));
                    }
                    else {
                        list += `${role.name}\n`;
                    }
                }
                embed.setDescription(list);
                await event.send({ embed: embed });
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