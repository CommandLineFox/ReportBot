"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const CommandHandler_1 = __importDefault(require("./command/CommandHandler"));
const EventHandler_1 = __importDefault(require("./event/EventHandler"));
class BotClient extends discord_js_1.Client {
    constructor(config, database, options) {
        super(options);
        this.config = config;
        this.database = database;
        new EventHandler_1.default(this);
        this.once("ready", async () => {
            new CommandHandler_1.default(this);
        });
    }
    async isMod(member, guild) {
        var _a, _b;
        if (this.isAdmin(member)) {
            return true;
        }
        const guildModel = await ((_a = this.database) === null || _a === void 0 ? void 0 : _a.guilds.findOne({ id: guild.id }));
        if (!guildModel) {
            return false;
        }
        const moderators = (_b = guildModel.config.roles) === null || _b === void 0 ? void 0 : _b.staff;
        if (!moderators) {
            return false;
        }
        if (moderators.length === 0) {
            return false;
        }
        let mod = false;
        moderators.forEach(id => {
            if (member.roles.cache.some(role => role.id === id)) {
                mod = true;
            }
        });
        return mod;
    }
    isAdmin(member) {
        return member.permissions.has("ADMINISTRATOR");
    }
    isOwner(user) {
        return this.config.owners.includes(user.id);
    }
    async getPrefix(guild) {
        if (guild) {
            const guildDb = await this.database.guilds.findOne({ id: guild.id });
            if (!guildDb) {
                return this.config.prefix;
            }
            if (guildDb.config.prefix) {
                return guildDb.config.prefix;
            }
        }
        return this.config.prefix;
    }
}
exports.default = BotClient;
//# sourceMappingURL=BotClient.js.map