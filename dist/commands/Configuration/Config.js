"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../command/Command"));
const Groups_1 = require("../../Groups");
class Config extends Command_1.default {
    constructor() {
        super({ name: "Config", triggers: ["config", "cfg"], description: "", group: Groups_1.Configuration });
    }
    async run(_event) {
        try {
        }
        catch (err) {
            console.log(err);
        }
    }
}
exports.default = Config;
//# sourceMappingURL=Config.js.map