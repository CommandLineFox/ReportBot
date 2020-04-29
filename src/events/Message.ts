import Event from "@event/Event";
import BotClient from "~/BotClient";
import { Message } from "discord.js";

export const event = new Event("message", async (_client: BotClient, _message: Message) => {
})