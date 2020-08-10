"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../command/Command"));
const Groups_1 = require("../../Groups");
class Test extends Command_1.default {
    constructor() {
        super({ name: "Test", triggers: ["test"], description: "Test command thing", group: Groups_1.OwnerOnly });
    }
    async run(event) {
        var _a;
        try {
            const message = event.message;
            const argument = event.argument;
            const client = event.client;
            const database = client.database;
            const id = parseInt(argument.split(' ')[0]);
            const guild = await database.guilds.findOne({ id: message.guild.id });
            const report = guild === null || guild === void 0 ? void 0 : guild.reports.find(report => report.id === id);
            if (!report) {
                event.send("The specified report doesn't exist");
                return;
            }
            const submitted = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.channels.cache.get(client.config.channels.submitted);
            const reportmessage = submitted.messages.cache.get(report.message);
            console.log(reportmessage);
        }
        catch (err) {
            console.log(err);
        }
    }
}
exports.default = Test;
//# sourceMappingURL=Test.js.map