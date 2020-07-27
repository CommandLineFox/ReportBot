"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../command/Command"));
const Groups_1 = require("../../Groups");
const ArgumentHandler_1 = __importDefault(require("../../command/ArgumentHandler"));
class Role extends Command_1.default {
    constructor() {
        super({ name: "Role", triggers: ["role"], description: "Gives or takes a specified role from a specified user", group: Groups_1.Moderation });
    }
    async run(event) {
        try {
            const args = await ArgumentHandler_1.default.getArguments(event, event.argument, "string", "member", "string");
            if (!args) {
                return;
            }
            const [subcommand, member, rolename] = args;
            const message = event.message;
            const channel = event.channel;
            const guild = event.guild;
            const client = event.client;
            if (rolename.toLowerCase() !== "vip" && rolename.toLowerCase() !== "mvp") {
                channel.send("Invalid arguments.")
                    .then((msg) => {
                    setTimeout(() => { msg.delete(); }, 5000);
                });
                message.delete();
                return;
            }
            let role;
            switch (rolename.toLowerCase()) {
                case "vip": {
                    role = guild.roles.cache.find(role => role.id === client.config.roles.vip);
                    break;
                }
                case "mvp": {
                    role = guild.roles.cache.find(role => role.id === client.config.roles.mvp);
                    break;
                }
            }
            switch (subcommand.toLowerCase()) {
                case "add": {
                    member.roles.add(role);
                    event.send(`Added ${role === null || role === void 0 ? void 0 : role.name} to ${member.user.tag}`);
                    break;
                }
                case "remove": {
                    member.roles.remove(role);
                    event.send(`Removed ${role === null || role === void 0 ? void 0 : role.name} from ${member.user.tag}`);
                    break;
                }
            }
        }
        catch (err) {
            console.log(err);
        }
    }
}
exports.default = Role;
//# sourceMappingURL=Role.js.map