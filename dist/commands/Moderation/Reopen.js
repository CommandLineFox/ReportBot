"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../command/Command"));
const Groups_1 = require("../../Groups");
const discord_js_1 = require("discord.js");
class Reopen extends Command_1.default {
    constructor() {
        super({ name: "Reopen", triggers: ["reopen", "open"], description: "Reopens the specified solved report", group: Groups_1.Moderation });
    }
    async run(event) {
        var _a;
        try {
            const message = event.message;
            const argument = event.argument;
            const client = event.client;
            const database = client.database;
            const id = parseInt(argument.split(" ")[0]);
            const guild = await database.getGuild(event.guild.id);
            if (!guild || !guild.config.channels || !guild.config.channels.submitted) {
                await event.send("The reports channel doesn't exist.");
                return;
            }
            const report = guild.reports.find(report => report.id === id);
            if (!report) {
                await event.send("The specified report doesn't exist.");
                return;
            }
            if (!report.handled) {
                await event.send("The specified report hasn't been handled yet.");
                return;
            }
            database === null || database === void 0 ? void 0 : database.guilds.updateOne({ id: guild.id, "reports.id": report.id }, { "$set": { "reports.$.handled": false } });
            const submitted = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.channels.cache.get(guild.config.channels.submitted);
            const reportMessage = await submitted.messages.fetch(report.message);
            const embed = new discord_js_1.MessageEmbed()
                .setTitle(`Case: ${report.id}`)
                .addField("User", report.user)
                .addField("Reported by", report.reporter)
                .addField("Reason", report.reason)
                .addField("Evidence", report.evidence);
            if (report.type) {
                embed.setColor("FF00FF");
            }
            else {
                embed.setColor("0000FF");
            }
            reportMessage === null || reportMessage === void 0 ? void 0 : reportMessage.edit({ embed: embed });
            await event.send(`Successfully reopened case ${report.id}`);
        }
        catch (err) {
            console.log(err);
        }
    }
}
exports.default = Reopen;
//# sourceMappingURL=Reopen.js.map