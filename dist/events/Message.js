"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
const Event_1 = __importDefault(require("../event/Event"));
exports.event = new Event_1.default("message", async (_client, message) => {
    if (message.author.bot) {
        return;
    }
    if (_client.config.channels.suggestions.includes(message.channel.id)) {
        await message.react("✅");
        await message.react("❌");
    }
});
//# sourceMappingURL=Message.js.map