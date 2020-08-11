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
    async run(_event) {
        try {
        }
        catch (err) {
            console.log(err);
        }
    }
}
exports.default = Test;
//# sourceMappingURL=Test.js.map