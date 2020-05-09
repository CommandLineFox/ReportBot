"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../command/Command"));
const Groups_1 = require("../../Groups");
const ArgumentHandler_1 = __importDefault(require("../../command/ArgumentHandler"));
class Staff extends Command_1.default {
    constructor() {
        super({ name: "Staff", triggers: ["staff"], description: "Add or remove staff roles for the server", group: Groups_1.Configuration });
    }
    async run(event) {
        var _a, _b, _c, _d, _e, _f;
        try {
            const message = event.message;
            const database = event.client.database;
            const args = await ArgumentHandler_1.default.getArguments(event, event.argument, "string", "string");
            if (!args) {
                if (args !== ["list"]) {
                    event.reply("invalid arguments.");
                }
                return;
            }
            switch (args[0]) {
                case "add": {
                    const role = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.roles.cache.find(role => role.name.toLowerCase() === args[1].toLowerCase());
                    if (!role) {
                        event.send("Couldn't find the role.");
                        return;
                    }
                    await (database === null || database === void 0 ? void 0 : database.guilds.updateOne({
                        id: (_b = message.guild) === null || _b === void 0 ? void 0 : _b.id
                    }, {
                        "$push": {
                            "config.roles.staff": {
                                id: role === null || role === void 0 ? void 0 : role.id
                            }
                        }
                    }).then(() => event.send(`${role === null || role === void 0 ? void 0 : role.name} is now a staff role.`)));
                    break;
                }
                case "remove": {
                    const role = (_c = message.guild) === null || _c === void 0 ? void 0 : _c.roles.cache.find(role => role.name.toLowerCase() === args[1].toLowerCase());
                    if (!role) {
                        event.send("Couldn't find the role.");
                        return;
                    }
                    await (database === null || database === void 0 ? void 0 : database.guilds.updateOne({
                        id: (_d = message.guild) === null || _d === void 0 ? void 0 : _d.id
                    }, {
                        "$pull": {
                            "config.roles.staff": {
                                id: role === null || role === void 0 ? void 0 : role.id
                            }
                        }
                    }).then(() => event.send(`${role === null || role === void 0 ? void 0 : role.name} is no longer a staff role.`)));
                    break;
                }
                case "list": {
                    const guild = await (database === null || database === void 0 ? void 0 : database.guilds.findOne({ id: (_e = message.guild) === null || _e === void 0 ? void 0 : _e.id }));
                    event.send(((_f = guild === null || guild === void 0 ? void 0 : guild.config.roles) === null || _f === void 0 ? void 0 : _f.staff).join(' '));
                    break;
                }
                default: {
                    event.send("valid subcommands are `add`, `remove` and `list`.");
                }
            }
        }
        catch (err) {
            console.log(err);
        }
    }
}
exports.default = Staff;
//# sourceMappingURL=Staff.js.map