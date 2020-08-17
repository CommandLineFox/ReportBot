import Command from "@command/Command";
import { Moderation } from "~/Groups";
import CommandEvent from "@command/CommandEvent";
import { TextChannel, MessageEmbed } from "discord.js";

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

            const id = parseInt(args.shift()!.trim());
            const segment = args.shift()!.trim();
            const value = args.join(' ');


            let guild = await database!.guilds.findOne({ id: message.guild!.id });
            let report = guild?.reports.find(report => report.id === id)!;
            if (!report) {
                event.send("The specified report doesn't exist.");
                return;
            }

            switch (segment.toLowerCase()) {
                case "user": {
                    database?.guilds.updateOne({ id: guild!.id, "reports.id": report.id }, { "$set": { "reports.$.user": value } });
                    event.send(`Successfully updated the user of case ${id}`);
                    break;
                }
                case "reason": {
                    database?.guilds.updateOne({ id: guild!.id, "reports.id": report.id }, { "$set": { "reports.$.reason": value } });
                    event.send(`Successfully updated the reason of case ${id}`);
                    break;
                }
                case "evidence": {
                    database?.guilds.updateOne({ id: guild!.id, "reports.id": report.id }, { "$set": { "reports.$.evidence": value } });
                    event.send(`Successfully updated the evidence of case ${id}`);
                    break;
                }
            }

            guild = await database!.guilds.findOne({ id: message.guild!.id });
            report = guild?.reports.find(report => report.id === id)!;
            const submitted = message.guild?.channels.cache.get(client.config.channels.submitted);
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

            reportmessage?.edit({ embed: embed });
        }
        catch (err) {
            console.log(err);
        }
    }
}