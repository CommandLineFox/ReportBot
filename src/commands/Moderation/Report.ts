import Command from "@command/Command";
import { PublicAccess } from "~/Groups";
import CommandEvent from "@command/CommandEvent";
import { MessageEmbed, TextChannel } from "discord.js";

export default class Report extends Command {
    public constructor() {
        super({ name: "Report", triggers: ["report", "submit"], description: "Reports a specified user to staff", group: PublicAccess });
    }

    public async run(event: CommandEvent): Promise<void> {
        try {
            const message = event.message;
            const argument = event.argument;
            const database = event.client.database!;
            const member = event.member;

            const guild = await database.getGuild(event.guild.id);
            if (!guild || !guild.config.channels || !guild.config.channels.submitted) {
                await event.send("The reports channel doesn't exist.");
                return;
            }

            if (!guild.config.channels.dump) {
                await event.send("The dump channel doesn't exist.");
                return;
            }

            const dump = event.guild.channels.cache.get(guild.config.channels.dump) as TextChannel;
            if (!dump) {
                await event.send("The dump channel doesn't exist.");
                return;
            }

            const attachment = message.attachments.first();
            let dumped;
            if (attachment) {
                dumped = await dump.send(attachment);
            }

            const [user, reason, evidence = dumped?.attachments.first()?.url] = argument.split("|");
            if (!user || !reason || !evidence) {
                return;
            }

            const id = (guild.reports.length) ? guild.reports.length + 1 : 1;
            const type = (await event.client.isMod(member, event.guild));

            const embed = new MessageEmbed()
                .addField("User", user.trim())
                .addField("Reported by", message.author.tag)
                .addField("Reason", reason.trim())
                .addField("Evidence", evidence.trim());

            let color;
            if (type) {
                color = "FF00FF";
            } else {
                color = "0000FF";
            }

            embed.setColor(color);

            const channel = event.guild.channels.cache.get(guild.config.channels.submitted);
            const msgId = (await (channel as TextChannel).send({ embed: embed })).id;
            await message.delete();

            await database.guilds.updateOne({
                id: message.guild?.id
            }, {
                "$push": {
                    reports: {
                        id: id,
                        user: user,
                        reason: reason,
                        evidence: evidence,
                        reporter: message.author.tag,
                        handled: false,
                        type: type,
                        message: msgId
                    }
                }
            });
        } catch (err) {
            console.log(err);
        }
    }
}
