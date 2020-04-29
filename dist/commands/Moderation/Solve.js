"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../command/Command"));
const Groups_1 = require("../../Groups");
const Helpers_1 = require("../../utils/Helpers");
class Submit extends Command_1.default {
    constructor() {
        super({ name: "Solve", triggers: ["approve", "solve"], description: "Generates a report on a specified user", group: Groups_1.Moderation });
    }
    async run(event) {
        try {
            const message = event.message;
            const argument = event.argument;
            const database = event.client.database;
            Helpers_1.SolveReport(argument, message, database);
        }
        catch (err) {
            console.log(err);
        }
    }
}
exports.default = Submit;
//# sourceMappingURL=Solve.js.map