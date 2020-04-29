"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
async function SubmitReport(argument, message, database) {
    var _a;
    let channel;
    const guild = await database.guilds.findOne({ id: message.guild.id });
    const [user, reason, evidence] = argument.split('|');
    const id = guild === null || guild === void 0 ? void 0 : guild.reports.length;
    const report = {
        id: id,
        user: user,
        reason: reason,
        evidence: evidence,
        staff: message.author.tag,
        handled: false
    };
    guild.reports.push(report);
    const embed = new discord_js_1.MessageEmbed()
        .setTitle(`Case: ${report.id}`)
        .addField(`User`, report.user)
        .addField(`Staff`, report.staff)
        .addField(`Reason`, report.reason)
        .addField(`Evidence`, report.evidence);
    channel = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.channels.cache.get((guild === null || guild === void 0 ? void 0 : guild.config.channels).submitted);
    channel.send({ embed: embed })
        .then((msg) => {
        msg;
        guild.reports[report.id].message = msg.id;
    });
}
exports.SubmitReport = SubmitReport;
async function SolveReport(argument, message, database) {
    var _a, _b, _c;
    let channel;
    const id = parseInt(argument.split(' ')[0]);
    const guild = await database.guilds.findOne({ id: message.guild.id });
    const report = guild === null || guild === void 0 ? void 0 : guild.reports.find(report => report.id === id);
    const submitted = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.channels.cache.get((guild === null || guild === void 0 ? void 0 : guild.config.channels).submitted);
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
exports.SolveReport = SolveReport;
//# sourceMappingURL=Helpers.js.map