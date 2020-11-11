import Command from "@command/Command";
import { Moderation } from "~/Groups";
import CommandEvent from "@command/CommandEvent";
import { TextChannel, MessageEmbed } from "discord.js";

export default class Reopen extends Command {
    constructor() {
        super({ name: "Reopen", triggers: ["reopen", "open"], description: "Reopens the specified solved report", group: Moderation });
    }

    async run(event: CommandEvent) {
        try {
            const message = event.message;
            const argument = event.argument;
            const client = event.client;
            const database = client.database;

            const id = parseInt(argument.split(' ')[0]);
            const guild = await database!.guilds.findOne({ id: message.guild!.id });

            if (!guild || !guild.config.channels || !guild.config.channels.submitted) {
                event.send("The reports channel doesn't exist.");
                return;
            }

            const report = guild?.reports.find(report => report.id === id)!;
            if (!report) {
                event.send("The specified report doesn't exist.");
                return;
            }
            
            if (!report.handled) {
                event.send("The specified report hasn't been handled yet.");
                return;
            }
            database?.guilds.updateOne({ id: guild!.id, "reports.id": report.id }, { "$set": { "reports.$.handled": false } })

            const submitted = message.guild?.channels.cache.get(guild.config.channels.submitted);
            const reportmessage = await (submitted as TextChannel).messages.fetch(report.message!);

            const embed = new MessageEmbed()
                .setTitle(`Case: ${report.id}`)
                .addField(`User`, report.user)
                .addField(`Reported by`, report.reporter)
                .addField(`Reason`, report.reason)
                .addField(`Evidence`, report.evidence)

            if (report.type) {
                embed.setColor("FF00FF");
            }
            else {
                embed.setColor("0000FF");
            }

            reportmessage?.edit({ embed: embed });
            event.send(`Successfully reopened case ${report.id}`);
        }
        catch (err) {
            console.log(err);
        }
    }
}