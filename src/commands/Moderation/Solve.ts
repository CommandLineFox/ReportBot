import Command from "@command/Command";
import { Moderation } from "~/Groups";
import CommandEvent from "@command/CommandEvent";
import { TextChannel, MessageEmbed } from "discord.js";
import { splitArguments } from "@utils/Utils";

export default class Solve extends Command {
    public constructor() {
        super({ name: "Solve", triggers: ["approve", "solve"], description: "Marks a specified report as handled", group: Moderation });
    }

    public async run(event: CommandEvent): Promise<void> {
        try {
            const message = event.message;
            const argument = event.argument;
            const client = event.client;
            const database = client.database;

            const [idstring, actiontype] = splitArguments(argument, 2);
            const id = parseInt(idstring);

            const guild = await database.guilds.findOne({ id: message.guild!.id });

            if (!guild || !guild.config.channels || !guild.config.channels.submitted) {
                await event.send("The reports channel doesn't exist.");
                return;
            }

            const report = guild.reports.find(report => report.id === id)!;
            if (!report) {
                await event.send("The specified report doesn't exist.");
                return;
            }
            if (report.handled) {
                await event.send("The specified report has already been handled.");
                return;
            }
            database.guilds.updateOne({ id: guild!.id, "reports.id": report.id }, { "$set": { "reports.$.handled": true } });

            const submitted = message.guild?.channels.cache.get(guild.config.channels.submitted);
            const reportMessage = await (submitted as TextChannel).messages.fetch(report.message!);

            let action = "";
            if (client.isMod(event.member, event.guild) && actiontype) {
                switch (actiontype.trim().toLowerCase()) {
                    case "kick": {
                        action = " - Kicked";
                        break;
                    }

                    case "ban": {
                        action = " - Banned";
                        break;
                    }
                }
            }

            const embed = new MessageEmbed()
                .setTitle(`Case: ${report.id} ${action}`)
                .addField("User", report.user)
                .addField("Reported by", report.reporter)
                .addField("Reason", report.reason)
                .addField("Evidence", report.evidence)
                .addField("Handled by", message.author.tag)
                .setColor("00FF00");

            reportMessage?.edit({ embed: embed });
            await event.send(`Successfully solved case ${report.id}`);
        } catch (err) {
            console.log(err);
        }
    }
}
