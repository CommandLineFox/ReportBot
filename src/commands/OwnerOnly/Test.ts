import Command from "@command/Command";
import { OwnerOnly } from "~/Groups";
import CommandEvent from "@command/CommandEvent";
import { TextChannel, MessageEmbed } from "discord.js";

export default class Test extends Command {
    constructor() {
        super({ name: "Test", triggers: ["test"], description: "Test command thing", group: OwnerOnly });
    }

    async run(event: CommandEvent) {
        try {
            const message = event.message;
            const argument = event.argument;
            const client = event.client;
            const database = client.database;

            const id = parseInt(argument.split(' ')[0]);
            const guild = await database!.guilds.findOne({ id: message.guild!.id });
            const report = guild?.reports.find(report => report.id === id)!;
            if (!report) {
                event.send("The specified report doesn't exist");
                return;
            }
            
            const submitted = message.guild?.channels.cache.get(client.config.channels.submitted);
            const reportmessage = await (submitted as TextChannel).messages.fetch(report.message!);
            
            const embed = new MessageEmbed()
                .setTitle(`Case: ${report.id}`)
                .addField(`User`, report.user)
                .addField(`Reported by`, report.reporter)
                .addField(`Reason`, report.reason)
                .addField(`Evidence`, report.evidence)
                .addField(`Handled by`, message.author.tag)
                .setColor(`00FF00`);

            reportmessage?.edit({ embed: embed });
        }
        catch (err) {
            console.log(err);
        }
    }
}