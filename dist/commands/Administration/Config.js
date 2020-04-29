"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../command/Command"));
const Groups_1 = require("../../Groups");
const ArgumentHandler_1 = __importDefault(require("../../command/ArgumentHandler"));
class Config extends Command_1.default {
    constructor() {
        super({ name: "Config", triggers: ["config", "cfg"], description: "", group: Groups_1.Administration });
    }
    async run(event) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const database = event.client.database;
        const guild = await (database === null || database === void 0 ? void 0 : database.guilds.findOne({ id: event.guild.id }));
        const args = await ArgumentHandler_1.default.getArguments(event, event.argument, "string", "string");
        if (!args) {
            event.reply("invalid arguments.");
            return;
        }
        const [sub, argument] = args;
        switch (sub) {
            case "staff": {
                const subargument = await ArgumentHandler_1.default.getArguments(event, argument, "string", "string");
                if (!subargument) {
                    event.reply("invalid arguments.");
                    return;
                }
                const [sub2, value] = subargument;
                switch (sub2) {
                    case "add": {
                        const id = (_a = event.guild.roles.cache.find(role => role.name === value)) === null || _a === void 0 ? void 0 : _a.id;
                        if (id && !((_b = guild === null || guild === void 0 ? void 0 : guild.config.roles) === null || _b === void 0 ? void 0 : _b.staff).includes(id)) {
                            (_d = (_c = guild === null || guild === void 0 ? void 0 : guild.config.roles) === null || _c === void 0 ? void 0 : _c.staff) === null || _d === void 0 ? void 0 : _d.push(value);
                        }
                        else if (id && ((_e = guild === null || guild === void 0 ? void 0 : guild.config.roles) === null || _e === void 0 ? void 0 : _e.staff).includes(id)) {
                            event.reply("that role is already a staff role.");
                        }
                    }
                    case "remove": {
                        const id = (_f = event.guild.roles.cache.find(role => role.name === value)) === null || _f === void 0 ? void 0 : _f.id;
                        if (!id) {
                            event.reply("That role isn't a staff role");
                        }
                        else if (id && ((_g = guild === null || guild === void 0 ? void 0 : guild.config.roles) === null || _g === void 0 ? void 0 : _g.staff).includes(id)) {
                            (guild === null || guild === void 0 ? void 0 : guild.config.roles).staff = ((_h = guild === null || guild === void 0 ? void 0 : guild.config.roles) === null || _h === void 0 ? void 0 : _h.staff).filter(role => role !== id);
                        }
                    }
                    default: {
                        event.reply("valid subcommands are add and remove.");
                    }
                }
            }
        }
    }
}
exports.default = Config;
//# sourceMappingURL=Config.js.map