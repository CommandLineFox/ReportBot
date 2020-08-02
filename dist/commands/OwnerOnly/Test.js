"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../command/Command"));
const Groups_1 = require("../../Groups");
const discord_js_1 = require("discord.js");
const Guild_1 = require("../../models/Guild");
class Test extends Command_1.default {
    constructor() {
        super({ name: "Test", triggers: ["test"], description: "Test command thing", group: Groups_1.OwnerOnly });
    }
    async run(event) {
        var _a, _b;
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
            if (!guild.config.submitted) {
                event.send("There is no specified channel for me to send reports to.");
                return;
            }
            const [user, reason, evidence] = argument.split('|');
            let id = (guild === null || guild === void 0 ? void 0 : guild.reports.length) || 1;
            if (id !== 1) {
                id += 1;
            }
            let channel;
            let msgid;
            const embed = new discord_js_1.MessageEmbed()
                .setTitle(`Case: ${id}`)
                .addField(`User`, user)
                .addField(`Reported by`, message.author.tag)
                .addField(`Reason`, reason)
                .addField(`Evidence`, evidence);
            channel = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.channels.cache.get(guild === null || guild === void 0 ? void 0 : guild.config.submitted);
            channel.send({ embed: embed })
                .then((msg) => {
                msg;
                msgid = msg.id;
            });
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
                        handled: false,
                        message: msgid
                    }
                }
            }));
        }
        catch (err) {
            console.log(err);
        }
    }
}
exports.default = Test;
//# sourceMappingURL=Test.js.map