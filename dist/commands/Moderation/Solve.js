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
        var _a, _b, _c;
        try {
            const message = event.message;
            const argument = event.argument;
            const database = event.client.database;
            let channel;
            const id = parseInt(argument.split(' ')[0]);
            const guild = await database.guilds.findOne({ id: message.guild.id });
            const report = guild === null || guild === void 0 ? void 0 : guild.reports.find(report => report.id === id);
            const submitted = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.channels.cache.get(guild === null || guild === void 0 ? void 0 : guild.config.channels.submitted);
            const oldreport = submitted.messages.cache.get(report.message);
            const embed = new discord_js_1.MessageEmbed()
                .setTitle(`Case: ${report.id}`)
                .addField(`User`, report.user)
                .addField(`Staff`, report.staff)
                .addField(`Reason`, report.reason)
                .addField(`Evidence`, report.evidence)
                .addField(`Handled by`, message.author.tag)
                .setColor(`green`);
            channel = (_b = message.guild) === null || _b === void 0 ? void 0 : _b.channels.cache.get((_c = guild === null || guild === void 0 ? void 0 : guild.config.channels) === null || _c === void 0 ? void 0 : _c.handled);
            channel.send({ embed: embed })
                .then((msg) => {
                msg;
                guild.reports[report.id].message = msg.id;
                oldreport === null || oldreport === void 0 ? void 0 : oldreport.delete();
            });
        }
        catch (err) {
            console.log(err);
        }
    }
}
exports.default = Solve;
//# sourceMappingURL=Solve.js.map