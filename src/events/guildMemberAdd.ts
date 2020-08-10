import Event from "@event/Event";
import BotClient from "~/BotClient";
import { GuildMember } from "discord.js";

export const event = new Event("guildMemberAdd", async (client: BotClient, member: GuildMember) => {
    if (!member.user.bot) {
        const guild = member.guild;
        const role = guild.roles.cache.get(client.config.roles.member);
        member.roles.add(role!);
    }
})