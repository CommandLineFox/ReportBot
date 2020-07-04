"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Staff_1 = __importDefault(require("../commands/Configuration/Staff"));
const Help_1 = __importDefault(require("../commands/Basic/Help"));
const Ping_1 = __importDefault(require("../commands/Basic/Ping"));
const Submit_1 = __importDefault(require("../commands/Moderation/Submit"));
const Echo_1 = __importDefault(require("../commands/OwnerOnly/Echo"));
const Eval_1 = __importDefault(require("../commands/OwnerOnly/Eval"));
const LogOff_1 = __importDefault(require("../commands/OwnerOnly/LogOff"));
const Report_1 = __importDefault(require("../commands/PublicAccess/Report"));
class CommandRegistry {
    constructor() {
        this.commands = [
            new Staff_1.default(),
            new Help_1.default(),
            new Report_1.default(),
            new Ping_1.default(),
            new Submit_1.default(),
            new Echo_1.default(),
            new Eval_1.default(),
            new LogOff_1.default()
        ];
        this.groups = this.commands.map((command) => command.group).filter((group, index, self) => self.indexOf(group) === index);
    }
    getCommands(group) {
        return this.commands.filter((command) => command.group === group);
    }
    getCommand(trigger) {
        return this.commands.find((command) => command.triggers.includes(trigger.toLowerCase()));
    }
}
exports.default = new CommandRegistry();
//# sourceMappingURL=CommandRegistry.js.map