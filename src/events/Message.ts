import Event from "@event/Event";
import BotClient from "~/BotClient";
import { Message } from "discord.js";

export const event = new Event("message", async (_client: BotClient, message: Message) => {
    if (message.author.bot) {
        return;
    }

    if (_client.config.channels.suggestions.includes(message.channel.id)) {
        await message.react("✅");
        await message.react("❌");
    }
})