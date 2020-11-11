"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const CommandHandler_1 = __importDefault(require("./command/CommandHandler"));
const EventHandler_1 = require("./event/EventHandler");
class BotClient extends discord_js_1.Client {
    constructor(config, database, options) {
        super(options);
        this.config = config;
        this.database = database;
        this.once("ready", () => {
            new CommandHandler_1.default(this);
            EventHandler_1.EventHandler(this);
        });
    }
    async isMod(member, guild) {
        var _a, _b;
        const guildmodel = await ((_a = this.database) === null || _a === void 0 ? void 0 : _a.guilds.findOne({ id: guild.id }));
        if (!guildmodel) {
            return false || this.isAdmin(member);
        }
        const moderators = (_b = guildmodel.config.roles) === null || _b === void 0 ? void 0 : _b.staff;
        if (!moderators) {
            return false || this.isAdmin(member);
        }
        if (moderators.length === 0) {
            return false || this.isAdmin(member);
        }
        let mod = false;
        moderators.forEach(id => {
            if (member.roles.cache.some(role => role.id === id)) {
                mod = true;
            }
        });
        return mod || this.isAdmin(member);
    }
    isAdmin(member) {
        if (member.permissions.has("ADMINISTRATOR")) {
            return true;
        }
        return false;
    }
    isOwner(user) {
        return this.config.owners.includes(user.id);
    }
    async getPrefix(guild) {
        if (guild) {
            let guilddb = await this.database.guilds.findOne({ id: guild.id });
            if (!guilddb) {
                return this.config.prefix;
            }
            if (guilddb.config.prefix) {
                return guilddb.config.prefix;
            }
        }
        return this.config.prefix;
    }
}
exports.default = BotClient;
//# sourceMappingURL=BotClient.js.map