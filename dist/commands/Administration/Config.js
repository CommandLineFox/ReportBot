"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../command/Command"));
const Groups_1 = require("../../Groups");
const discord_js_1 = require("discord.js");
const Utils_1 = require("../../utils/Utils");
class Config extends Command_1.default {
    constructor() {
        super({ name: "Config", triggers: ["config", "cfg", "setup"], description: "Configures various settings for the guild", group: Groups_1.Administration });
    }
    async run(event) {
        const client = event.client;
        const database = client.database;
        let guild = await client.getGuildFromDatabase(database, event.guild.id);
        const [subcommand, option, args] = Utils_1.splitArguments(event.argument, 3);
        if (!subcommand) {
            displayAllSettings(event, guild);
        }
        switch (subcommand.toLowerCase()) {
            case "prefix": {
                prefixSettings(event, option, args, guild);
                break;
            }
            case "staff": {
                moderatorSettings(event, option, args, guild);
                break;
            }
            case "roles": {
                roleSettings(event, option, args, guild);
            }
        }
    }
}
exports.default = Config;
async function prefixSettings(event, option, args, guild) {
    const client = event.client;
    const database = client.database;
    if (!option) {
        Utils_1.displayData(event, guild, "prefix", true);
        return;
    }
    switch (option.toLowerCase()) {
        case "set": {
            if (args.length > 5) {
                event.send("The prefix can be up to 5 characters.");
                break;
            }
            await (database === null || database === void 0 ? void 0 : database.guilds.updateOne({ id: guild === null || guild === void 0 ? void 0 : guild.id }, { "$set": { "config.prefix": args } }));
            event.send(`The prefix has been set to \`${args}\``);
            break;
        }
        case "reset": {
            await (database === null || database === void 0 ? void 0 : database.guilds.updateOne({ id: guild === null || guild === void 0 ? void 0 : guild.id }, { "$unset": { "config.prefix": "" } }));
            event.send(`The prefix has been set to \`${client.config.prefix}\``);
            break;
        }
    }
}
async function moderatorSettings(event, option, args, guild) {
    var _a, _b, _c, _d;
    const database = event.client.database;
    Utils_1.databaseCheck(database, guild, "staff");
    if (!option) {
        Utils_1.displayData(event, guild, "staff", true);
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
            if ((_b = (_a = guild.config.roles) === null || _a === void 0 ? void 0 : _a.staff) === null || _b === void 0 ? void 0 : _b.includes(role.id)) {
                event.send("The specified role is already a staff role.");
                break;
            }
            await (database === null || database === void 0 ? void 0 : database.guilds.updateOne({ id: guild.id }, { "$push": { "config.roles.staff": role.id } }));
            event.send(`Added \`${role.name}\` as a staff role.`);
            break;
        }
        case "remove": {
            if (!((_d = (_c = guild.config.roles) === null || _c === void 0 ? void 0 : _c.staff) === null || _d === void 0 ? void 0 : _d.includes(role.id))) {
                event.send("The specified role isn't a staff role.");
                break;
            }
            await (database === null || database === void 0 ? void 0 : database.guilds.updateOne({ id: guild.id }, { "$pull": { "config.roles.staff": role.id } }));
            event.send(`\`${role.name}\` is no longer a staff role.`);
            break;
        }
    }
}
async function roleSettings(event, option, args, guild) {
    const database = event.client.database;
    Utils_1.databaseCheck(database, guild, "roles");
    if (!option) {
        Utils_1.displayData(event, guild, "roles", true);
        return;
    }
    switch (option.toLowerCase()) {
        default: {
            switch (args) {
            }
        }
    }
}
async function displayAllSettings(event, guild) {
    const embed = new discord_js_1.MessageEmbed()
        .setTitle("The current settings for this server:")
        .addField("Prefix", await Utils_1.displayData(event, guild, "prefix"), true)
        .addField("Moderators", await Utils_1.displayData(event, guild, "staff"), true)
        .addField("Suggestions", await Utils_1.displayData(event, guild, "suggestions"), true)
        .addField("Reports", await Utils_1.displayData(event, guild, "report"), true)
        .addField("MVP", await Utils_1.displayData(event, guild, "mvp"), true)
        .addField("VIP", await Utils_1.displayData(event, guild, "vip"), true)
        .setColor("#61e096")
        .setFooter(`Requested by ${event.author.tag}`, event.author.displayAvatarURL());
    event.send({ embed: embed });
}
//# sourceMappingURL=Config.js.map