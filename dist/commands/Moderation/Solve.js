"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../command/Command"));
const Groups_1 = require("../../Groups");
const discord_js_1 = require("discord.js");
class Solve extends Command_1.default {
    constructor() {
        super({ name: "Solve", triggers: ["approve", "solve"], description: "Generates a report on a specified user", group: Groups_1.Moderation });
    }
    async run(event) {
        var _a;
        try {
            const message = event.message;
            const argument = event.argument;
            const client = event.client;
            const database = client.database;
            const id = parseInt(argument.split(' ')[0]);
            const guild = await database.guilds.findOne({ id: message.guild.id });
            const report = guild === null || guild === void 0 ? void 0 : guild.reports.find(report => report.id === id);
            if (!report) {
                event.send("The specified report doesn't exist.");
                return;
            }
            if (report.handled) {
                event.send("The specified report has already been handled.");
                return;
            }
            database === null || database === void 0 ? void 0 : database.guilds.updateOne({ id: guild.id, "reports.id": report.id }, { "$set": { "reports.$.handled": true } });
            const submitted = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.channels.cache.get(client.config.channels.submitted);
            const reportmessage = await submitted.messages.fetch(report.message);
            const embed = new discord_js_1.MessageEmbed()
                .setTitle(`Case: ${report.id}`)
                .addField(`User`, report.user)
                .addField(`Reported by`, report.reporter)
                .addField(`Reason`, report.reason)
                .addField(`Evidence`, report.evidence)
                .addField(`Handled by`, message.author.tag)
                .setColor(`00FF00`);
            reportmessage === null || reportmessage === void 0 ? void 0 : reportmessage.edit({ embed: embed });
            event.send(`Successfully solved case ${report.id}`);
        }
        catch (err) {
            console.log(err);
        }
    }
}
exports.default = Solve;
//# sourceMappingURL=Solve.js.map