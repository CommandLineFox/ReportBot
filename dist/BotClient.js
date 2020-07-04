"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const CommandHandler_1 = __importDefault(require("./command/CommandHandler"));
class BotClient extends discord_js_1.Client {
    constructor(config, database, options) {
        super(options);
        this.config = config;
        this.database = database;
        this.once("ready", () => {
            new CommandHandler_1.default(this);
        });
    }
    isMod(member, _guild) {
        let found = false;
        member.roles.cache.forEach((role) => {
            if (this.config.staff.includes(role.id)) {
                found = true;
            }
        });
        return found;
    }
    isAdmin(member) {
        return member.hasPermission("ADMINISTRATOR");
    }
    isOwner(user) {
        return this.config.owners.includes(user.id);
    }
    getPrefix(guild) {
        if (guild) {
        }
        return this.config.prefix;
    }
}
exports.default = BotClient;
//# sourceMappingURL=BotClient.js.map