"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../command/Command"));
const Groups_1 = require("../../Groups");
const Utils_1 = require("../../utils/Utils");
class Role extends Command_1.default {
    constructor() {
        super({ name: "Role", triggers: ["role"], description: "Gives or takes a specified role from a specified user", group: Groups_1.Moderation });
    }
    async run(event) {
        const client = event.client;
        const database = client.database;
        try {
            const guild = await client.getGuildFromDatabase(database, event.guild.id);
            const [subcommand, id, roleName] = Utils_1.splitArguments(event.argument, 3);
            const member = await client.getMember(id, event.guild);
            if (!subcommand) {
                await event.send("You must provide a subcommand first. Valid ones are `add` and `remove`.");
            }
            if (!member) {
                await event.send("Couldn't find the user you're looking for");
                return;
            }
            const message = event.message;
            const channel = event.channel;
            if (roleName.toLowerCase() !== "vip" && roleName.toLowerCase() !== "mvp") {
                channel.send("Role name can only be VIP or MVP")
                    .then((msg) => {
                    setTimeout(() => {
                        msg.delete();
                    }, 5000);
                });
                await message.delete();
                return;
            }
            let role;
            switch (roleName.toLowerCase()) {
                case "vip": {
                    role = event.guild.roles.cache.find(role => { var _a; return role.id === ((_a = guild === null || guild === void 0 ? void 0 : guild.config.roles) === null || _a === void 0 ? void 0 : _a.vip); });
                    break;
                }
                case "mvp": {
                    role = event.guild.roles.cache.find(role => role.id === (guild === null || guild === void 0 ? void 0 : guild.config.roles.mvp));
                    break;
                }
            }
            if (!role) {
                await event.send("Couldn't find the role you're looking for");
                return;
            }
            switch (subcommand.toLowerCase()) {
                case "add": {
                    await member.roles.add(role);
                    await event.send(`Added ${role === null || role === void 0 ? void 0 : role.name} to ${member.user.tag}`);
                    break;
                }
                case "remove": {
                    await member.roles.remove(role);
                    await event.send(`Removed ${role === null || role === void 0 ? void 0 : role.name} from ${member.user.tag}`);
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