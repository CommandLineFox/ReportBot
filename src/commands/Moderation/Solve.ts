import Command from "@command/Command";
import { Moderation } from "~/Groups";
import CommandEvent from "@command/CommandEvent";
import { TextChannel, MessageEmbed, Message } from "discord.js";

export default class Solve extends Command {
    constructor() {
        super({ name: "Solve", triggers: ["approve", "solve"], description: "Generates a report on a specified user", group: Moderation });
    }

    async run(event: CommandEvent) {
        try {
            const message = event.message;
            const argument = event.argument;
            const database = event.client.database;

            let channel;
            const id = parseInt(argument.split(' ')[0]);
            const guild = await database!.guilds.findOne({ id: message.guild!.id });
            const report = guild?.reports.find(report => report.id === id)!;
            const submitted = message.guild?.channels.cache.get(guild?.config.channels!.submitted!)
            const oldreport = (submitted as TextChannel).messages.cache.get(report.message!);

            const embed = new MessageEmbed()
                .setTitle(`Case: ${report.id}`)
                .addField(`User`, report.user)
                .addField(`Staff`, report.staff)
                .addField(`Reason`, report.reason)
                .addField(`Evidence`, report.evidence)
                .addField(`Handled by`, message.author.tag)
                .setColor(`green`);

            channel = message.guild?.channels.cache.get(guild?.config.channels?.handled!);
            (channel as TextChannel).send({ embed: embed })
                .then((msg) => {
                    msg as Message;
                    guild!.reports[report.id].message = msg.id;
                    oldreport?.delete();
                });
        }
        catch (err) {
            console.log(err);
        }
    }
}