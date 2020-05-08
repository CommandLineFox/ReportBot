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
    isMod(_member, _guild) {
        let mod = false;
        return mod;
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