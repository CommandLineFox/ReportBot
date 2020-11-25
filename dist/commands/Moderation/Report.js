"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../command/Command"));
const Groups_1 = require("../../Groups");
const discord_js_1 = require("discord.js");
class Report extends Command_1.default {
    constructor() {
        super({ name: "Report", triggers: ["report", "submit"], description: "Reports a specified user to staff", group: Groups_1.PublicAccess });
    }
    async run(event) {
        var _a, _b;
        try {
            const message = event.message;
            const argument = event.argument;
            const database = event.client.database;
            const member = event.member;
            const client = event.client;
            const guild = await client.getGuildFromDatabase(database, event.guild.id);
            if (!guild || !guild.config.channels || !guild.config.channels.submitted) {
                await event.send("The reports channel doesn't exist.");
                return;
            }
            const [user, reason, evidence] = argument.split("|");
            const id = (guild === null || guild === void 0 ? void 0 : guild.reports.length) ? (guild === null || guild === void 0 ? void 0 : guild.reports.length) + 1 : 1;
            const type = (await event.client.isMod(member, event.guild));
            const embed = new discord_js_1.MessageEmbed()
                .setTitle(`Case: ${id}`)
                .addField("User", user)
                .addField("Reported by", message.author.tag)
                .addField("Reason", reason)
                .addField("Evidence", evidence);
            if (type) {
                embed.setColor("FF00FF");
            }
            else {
                embed.setColor("0000FF");
            }
            const channel = (_a = event.guild) === null || _a === void 0 ? void 0 : _a.channels.cache.get(guild.config.channels.submitted);
            const msgId = (await channel.send({ embed: embed })).id;
            await message.delete();
            await (database === null || database === void 0 ? void 0 : database.guilds.updateOne({
                id: (_b = message.guild) === null || _b === void 0 ? void 0 : _b.id
            }, {
                "$push": {
                    reports: {
                        id: id,
                        user: user,
                        reason: reason,
                        evidence: evidence,
                        reporter: message.author.tag,
                        handled: false,
                        type: type,
                        message: msgId
                    }
                }
            }));
        }
        catch (err) {
            console.log(err);
        }
    }
}
exports.default = Report;
//# sourceMappingURL=Report.js.map