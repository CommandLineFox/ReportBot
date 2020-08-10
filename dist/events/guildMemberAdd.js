"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
const Event_1 = __importDefault(require("../event/Event"));
exports.event = new Event_1.default("guildMemberAdd", async (client, member) => {
    if (!member.user.bot) {
        const guild = member.guild;
        const role = guild.roles.cache.get(client.config.roles.member);
        member.roles.add(role);
    }
});
//# sourceMappingURL=guildMemberAdd.js.map