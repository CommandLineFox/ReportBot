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
        super({ name: "Config", triggers: ["config", "cfg"], description: "", group: Groups_1.Configuration });
    }
    async run(event) {
        var _a, _b, _c;
        try {
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
                            const id = await ((_a = event.guild.roles.cache.find(role => role.name.toLowerCase() === value.toLowerCase())) === null || _a === void 0 ? void 0 : _a.id);
                            if (id && !(guild === null || guild === void 0 ? void 0 : guild.config.staff.includes(id))) {
                                (_b = guild === null || guild === void 0 ? void 0 : guild.config.staff) === null || _b === void 0 ? void 0 : _b.push(value);
                            }
                            else if (id && (guild === null || guild === void 0 ? void 0 : guild.config.staff.includes(id))) {
                                event.reply("that role is already a staff role.");
                            }
                        }
                        case "remove": {
                            const id = await ((_c = event.guild.roles.cache.find(role => role.name.toLowerCase() === value)) === null || _c === void 0 ? void 0 : _c.id);
                            if (!id) {
                                event.reply("That role isn't a staff role");
                            }
                            else if (id && (guild === null || guild === void 0 ? void 0 : guild.config.staff.includes(id))) {
                                guild.config.staff = guild === null || guild === void 0 ? void 0 : guild.config.staff.filter(role => role !== id);
                            }
                        }
                        default: {
                            event.reply("valid subcommands are add and remove.");
                        }
                    }
                }
                case "submitchannel": {
                    const subargument = await ArgumentHandler_1.default.getArguments(event, argument, "string", "string");
                    if (!subargument) {
                        event.reply("invalid arguments.");
                        return;
                    }
                    const [sub2, value] = subargument;
                    switch (sub2) {
                        case "set": {
                            const id = await event.guild.channels.cache.get(value).id;
                            if (id && (guild === null || guild === void 0 ? void 0 : guild.config.submitted) === id) {
                                guild.config.submitted = value;
                            }
                            else if (id && (guild === null || guild === void 0 ? void 0 : guild.config.submitted) === value) {
                                event.reply("that channel is already selected.");
                            }
                        }
                        case "remove": {
                            guild.config.submitted = "";
                        }
                    }
                }
                case "handledchannel": {
                    const subargument = await ArgumentHandler_1.default.getArguments(event, argument, "string", "string");
                    if (!subargument) {
                        event.reply("invalid arguments.");
                        return;
                    }
                    const [sub2, value] = subargument;
                    switch (sub2) {
                        case "set": {
                            const id = event.guild.channels.cache.get(value).id;
                            if (id && (guild === null || guild === void 0 ? void 0 : guild.config.handled) === id) {
                                guild.config.handled = value;
                            }
                            else if (id && (guild === null || guild === void 0 ? void 0 : guild.config.handled) === value) {
                                event.reply("that channel is already selected.");
                            }
                        }
                        case "remove": {
                            guild.config.handled = "";
                        }
                    }
                }
                case "prefix": {
                    const prefix = argument[1];
                    if ((guild === null || guild === void 0 ? void 0 : guild.config.prefix) === prefix) {
                        event.reply("that prefix is already set.");
                    }
                    else {
                        guild.config.prefix = prefix;
                    }
                }
                default: {
                    event.reply("valid subcommands are submitchannel, handledchannel and prefix.");
                }
            }
        }
        catch (err) {
            console.log(err);
        }
    }
}
exports.default = Config;
//# sourceMappingURL=Config.js.map