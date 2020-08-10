"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../command/Command"));
const Groups_1 = require("../../Groups");
class Solve extends Command_1.default {
    constructor() {
        super({ name: "Solve", triggers: ["approve", "solve"], description: "Generates a report on a specified user", group: Groups_1.Moderation });
    }
    async run(_event) {
        try {
        }
        catch (err) {
            console.log(err);
        }
    }
}
exports.default = Solve;
//# sourceMappingURL=Solve.js.map