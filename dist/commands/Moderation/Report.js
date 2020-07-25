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
        try {
            const member = event.member;
            const message = event.message;
            const guild = event.guild;
            const argument = event.argument;
            const channel = event.channel;
            if (argument.split('|').length != 3) {
                channel.send("Invalid arguments.")
                    .then((msg) => {
                    setTimeout(() => { msg.delete(); }, 5000);
                });
                message.delete();
                return;
            }
            const [user, reason, evidence] = argument.split('|');
            const embed = new discord_js_1.MessageEmbed()
                .addField(`User`, user)
                .addField(`Reported by`, message.author.tag)
                .addField(`Reason`, reason)
                .addField(`Evidence`, evidence);
            const endpoint = (event.client.isMod(member, guild) || event.client.isAdmin(member)) ? guild === null || guild === void 0 ? void 0 : guild.channels.cache.get(event.client.config.channels.staffsubmitted) : guild === null || guild === void 0 ? void 0 : guild.channels.cache.get(event.client.config.channels.submitted);
            endpoint.send({ embed: embed });
            message.delete();
        }
        catch (err) {
            console.log(err);
        }
    }
}
exports.default = Report;
//# sourceMappingURL=Report.js.map