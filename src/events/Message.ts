import Event from "@event/Event";
import BotClient from "~/BotClient";
import {Message} from "discord.js";
import {Guild} from "@models/Guild";

export const event = new Event("message", async (client: BotClient, message: Message) => {
    if (message.author.bot || !message.guild) {
        return;
    }

    const database = client.database;
    let guild = await database!.guilds.findOne({id: message.guild.id});
    if (!guild) {
        const newguild = new Guild({id: message.guild.id});
        await database!.guilds.insertOne(newguild);
        guild = await database!.guilds.findOne({id: message.guild.id});
    }

    if (!guild || !guild.config.channels || !guild.config.channels.suggestions || guild.config.channels.suggestions.length === 0) {
        return;
    }

    if (guild.config.channels.suggestions.includes(message.channel.id)) {
        await message.react("✅");
        await message.react("❌");
    }
});
