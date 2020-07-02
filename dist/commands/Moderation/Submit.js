"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../command/Command"));
const Groups_1 = require("../../Groups");
const discord_js_1 = require("discord.js");
const Guild_1 = require("../../models/Guild");
class Submit extends Command_1.default {
    constructor() {
        super({ name: "Submit", triggers: ["submit", "report"], description: "Generates a report on a specified user", group: Groups_1.Moderation });
    }
    async run(event) {
        var _a, _b, _c;
        try {
            const message = event.message;
            const argument = event.argument;
            const database = event.client.database;
            let guild = await database.guilds.findOne({ id: event.guild.id });
            if (!guild) {
                const newguild = new Guild_1.Guild({ id: event.guild.id });
                await database.guilds.insertOne(newguild);
                guild = await database.guilds.findOne({ id: event.guild.id });
            }
            if (!((_a = guild.config.channels) === null || _a === void 0 ? void 0 : _a.submitted)) {
                event.send("There is no specified channel for me to send reports to.");
                return;
            }
            const [user, reason, evidence] = argument.split('|');
            let id = (guild === null || guild === void 0 ? void 0 : guild.reports.length) || 1;
            if (id !== 1) {
                id += 1;
            }
            await (database === null || database === void 0 ? void 0 : database.guilds.updateOne({
                id: (_b = message.guild) === null || _b === void 0 ? void 0 : _b.id
            }, {
                "$push": {
                    reports: {
                        id: id,
                        user: user,
                        reason: reason,
                        evidence: evidence,
                        staff: message.author.tag,
                        handled: false
                    }
                }
            }));
            let channel;
            const embed = new discord_js_1.MessageEmbed()
                .setTitle(`Case: ${id}`)
                .addField(`User`, user)
                .addField(`Staff`, message.author.tag)
                .addField(`Reason`, reason)
                .addField(`Evidence`, evidence);
            channel = (_c = message.guild) === null || _c === void 0 ? void 0 : _c.channels.cache.get(guild === null || guild === void 0 ? void 0 : guild.config.channels.submitted);
            channel.send({ embed: embed })
                .then((msg) => {
                msg;
                guild.reports[id].message = msg.id;
            });
        }
        catch (err) {
            console.log(err);
        }
    }
}
exports.default = Submit;
//# sourceMappingURL=Submit.js.map