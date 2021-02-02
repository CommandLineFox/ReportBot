import Command from "@command/Command";
import { Moderation } from "~/Groups";
import CommandEvent from "@command/CommandEvent";
import { TextChannel, MessageEmbed } from "discord.js";
import { splitArguments } from "@utils/Utils";

export default class Edit extends Command {
    public constructor() {
        super({ name: "Edit", triggers: ["edit", "change"], description: "Edits a part of the report", group: Moderation });
    }

    public async run(event: CommandEvent): Promise<void> {
        try {
            const message = event.message;
            const argument = event.argument;
            const client = event.client;
            const database = client.database;

            const [id, segment, value] = splitArguments(argument, 3);
            let guild = await database.getGuild(event.guild.id);
            if (!guild) {
                return;
            }

            let report = guild.reports.find(report => report.id === parseInt(id))!;
            if (!report) {
                await event.send("The specified report doesn't exist.");
                return;
            }

            switch (segment.toLowerCase()) {
                case "user": {
                    await database?.guilds.updateOne({
                        id: guild!.id,
                        "reports.id": report.id
                    }, { "$set": { "reports.$.user": value } });
                    await event.send(`Successfully updated the user of case ${id}`);
                    break;
                }
                case "reason": {
                    await database?.guilds.updateOne({
                        id: guild!.id,
                        "reports.id": report.id
                    }, { "$set": { "reports.$.reason": value } });
                    await event.send(`Successfully updated the reason of case ${id}`);
                    break;
                }
                case "evidence": {
                    await database?.guilds.updateOne({
                        id: guild!.id,
                        "reports.id": report.id
                    }, { "$set": { "reports.$.evidence": value } });
                    await event.send(`Successfully updated the evidence of case ${id}`);
                    break;
                }
            }

            guild = await database!.guilds.findOne({ id: message.guild!.id });
            if (!guild || !guild.config.channels || !guild.config.channels.submitted) {
                await event.send("The reports channel doesn't exist.");
                return;
            }

            report = guild.reports.find(report => report.id === parseInt(id))!;
            const submitted = message.guild?.channels.cache.get(guild.config.channels.submitted);
            const reportMessage = await (submitted as TextChannel).messages.fetch(report.message!);

            const embed = new MessageEmbed()
                .setTitle(`Case: ${report.id}`)
                .addField("User", report.user)
                .addField("Reported by", report.reporter)
                .addField("Reason", report.reason)
                .addField("Evidence", report.evidence);

            if (report.type) {
                embed.setColor("FF00FF");
            } else {
                embed.setColor("0000FF");
            }

            await reportMessage?.edit({ embed: embed });
        } catch (err) {
            console.log(err);
        }
    }
}
