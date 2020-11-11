"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
const Event_1 = __importDefault(require("../event/Event"));
const Guild_1 = require("../models/Guild");
exports.event = new Event_1.default("message", async (client, message) => {
    if (message.author.bot || !message.guild) {
        return;
    }
    const database = client.database;
    let guild = await database.guilds.findOne({ id: message.guild.id });
    if (!guild) {
        const newguild = new Guild_1.Guild({ id: message.guild.id });
        await database.guilds.insertOne(newguild);
        guild = await database.guilds.findOne({ id: message.guild.id });
    }
    if (!guild || !guild.config.channels || !guild.config.channels.suggestions || guild.config.channels.suggestions.length === 0) {
        return;
    }
    if (guild.config.channels.suggestions.includes(message.channel.id)) {
        message.react('✅');
        message.react('❌');
    }
});
//# sourceMappingURL=Message.js.map