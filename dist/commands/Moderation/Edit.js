"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../command/Command"));
const Groups_1 = require("../../Groups");
const discord_js_1 = require("discord.js");
const Utils_1 = require("../../utils/Utils");
class Edit extends Command_1.default {
    constructor() {
        super({ name: "Edit", triggers: ["edit", "change"], description: "Edits a part of the report", group: Groups_1.Moderation });
    }
    async run(event) {
        var _a;
        try {
            const message = event.message;
            const argument = event.argument;
            const client = event.client;
            const database = client.database;
            const [id, segment, value] = Utils_1.splitArguments(argument, 3);
            let guild = await client.getGuildFromDatabase(database, event.guild.id);
            let report = guild.reports.find(report => report.id === parseInt(id));
            if (!report) {
                await event.send("The specified report doesn't exist.");
                return;
            }
            switch (segment.toLowerCase()) {
                case "user": {
                    await (database === null || database === void 0 ? void 0 : database.guilds.updateOne({
                        id: guild.id,
                        "reports.id": report.id
                    }, { "$set": { "reports.$.user": value } }));
                    await event.send(`Successfully updated the user of case ${id}`);
                    break;
                }
                case "reason": {
                    await (database === null || database === void 0 ? void 0 : database.guilds.updateOne({
                        id: guild.id,
                        "reports.id": report.id
                    }, { "$set": { "reports.$.reason": value } }));
                    await event.send(`Successfully updated the reason of case ${id}`);
                    break;
                }
                case "evidence": {
                    await (database === null || database === void 0 ? void 0 : database.guilds.updateOne({
                        id: guild.id,
                        "reports.id": report.id
                    }, { "$set": { "reports.$.evidence": value } }));
                    await event.send(`Successfully updated the evidence of case ${id}`);
                    break;
                }
            }
            guild = await database.guilds.findOne({ id: message.guild.id });
            if (!guild || !guild.config.channels || !guild.config.channels.submitted) {
                await event.send("The reports channel doesn't exist.");
                return;
            }
            report = guild.reports.find(report => report.id === parseInt(id));
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
            await (reportMessage === null || reportMessage === void 0 ? void 0 : reportMessage.edit({ embed: embed }));
        }
        catch (err) {
            console.log(err);
        }
    }
}
exports.default = Edit;
//# sourceMappingURL=Edit.js.map