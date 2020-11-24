import Command from "@command/Command";
import { Moderation } from "~/Groups";
import CommandEvent from "@command/CommandEvent";
import { TextChannel, MessageEmbed } from "discord.js";
import { splitArguments } from "@utils/Utils";

export default class Edit extends Command {
    constructor() {
        super({ name: "Edit", triggers: ["edit", "change"], description: "Edits a part of the report", group: Moderation });
    }

    async run(event: CommandEvent) {
        try {
            const message = event.message;
            const argument = event.argument;
            const client = event.client;
            const database = client.database;

            const args = argument.split(' ');
            if (!args.length) {
                return;
            }
            
            const [id, segment, value] = splitArguments(event.argument, 3);
            let guild = await client.getGuildFromDatabase(database!, event.guild.id);

            let report = guild?.reports.find(report => report.id === parseInt(id))!;
            if (!report) {
                await event.send("The specified report doesn't exist.");
                return;
            }

            switch (segment.toLowerCase()) {
                case "user": {
                    await database?.guilds.updateOne({ id: guild!.id, "reports.id": report.id }, { "$set": { "reports.$.user": value } });
                    await event.send(`Successfully updated the user of case ${id}`);
                    break;
                }
                case "reason": {
                    await database?.guilds.updateOne({ id: guild!.id, "reports.id": report.id }, { "$set": { "reports.$.reason": value } });
                    await event.send(`Successfully updated the reason of case ${id}`);
                    break;
                }
                case "evidence": {
                    await database?.guilds.updateOne({ id: guild!.id, "reports.id": report.id }, { "$set": { "reports.$.evidence": value } });
                    await event.send(`Successfully updated the evidence of case ${id}`);
                    break;
                }
            }

            guild = await database!.guilds.findOne({ id: message.guild!.id });
            if (!guild || !guild.config.channels || !guild.config.channels.submitted) {
                await event.send("The reports channel doesn't exist.");
                return;
            }

            report = guild?.reports.find(report => report.id === parseInt(id))!;
            const submitted = message.guild?.channels.cache.get(guild.config.channels.submitted);
            const reportmessage = await (submitted as TextChannel).messages.fetch(report.message!);

            const embed = new MessageEmbed()
                .setTitle(`Case: ${report.id}`)
                .addField(`User`, report.user)
                .addField(`Reported by`, report.reporter)
                .addField(`Reason`, report.reason)
                .addField(`Evidence`, report.evidence);

            if (report.type) {
                embed.setColor("FF00FF");
            }
            else {
                embed.setColor("0000FF");
            }

            await reportmessage?.edit({ embed: embed });
        }
        catch (err) {
            console.log(err);
        }
    }
}