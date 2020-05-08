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
        super({ name: "Staff", triggers: ["staff"], description: "Add or remove staff roles for the server", group: Groups_1.Configuration });
    }
    async run(event) {
        var _a;
        try {
            const message = event.message;
            const database = event.client.database;
            const args = await ArgumentHandler_1.default.getArguments(event, event.argument, "string", "string");
            if (!args) {
                event.reply("invalid arguments.");
                return;
            }
            const [sub, argument] = args;
            switch (sub) {
                case "add": {
                    await (database === null || database === void 0 ? void 0 : database.guilds.updateOne({
                        id: (_a = message.guild) === null || _a === void 0 ? void 0 : _a.id
                    }, {
                        "$push": {
                            staff: {
                                argument
                            }
                        }
                    }));
                }
                case "remove": {
                }
                default: {
                    event.send("valid subcommands are `add` and `remove`.");
                }
            }
        }
        catch (err) {
        }
    }
}
exports.default = Config;
//# sourceMappingURL=Staff.js.map