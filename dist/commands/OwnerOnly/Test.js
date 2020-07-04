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
        const database = event.client.database;
        const staff = await (database === null || database === void 0 ? void 0 : database.guilds.findOne({ config: { staff: [..."705152765059530772"] } }));
        console.log(staff);
    }
}
exports.default = Test;
//# sourceMappingURL=Test.js.map