import Command from "@command/Command";
import { PublicAccess } from "~/Groups";
import CommandEvent from "@command/CommandEvent";
import { MessageEmbed, TextChannel } from "discord.js";

export default class Report extends Command {
    constructor() {
        super({ name: "Report", triggers: ["report"], description: "Reports a specified user to staff", group: PublicAccess });
    }

    async run(event: CommandEvent) {
        try {
            const message = event.message;
            const argument = event.argument;
            if (argument.split('|').length != 3) {
                event.send("Invalid arguments.");
                return;
            }
            
            const [user, reason, evidence] = argument.split('|');

            let channel;

            const embed = new MessageEmbed()
                .addField(`User`, user)
                .addField(`Staff`, message.author.tag)
                .addField(`Reason`, reason)
                .addField(`Evidence`, evidence);

            channel = message.guild?.channels.cache.get(event.client.config.channels.submitted);

            (channel as TextChannel).send({ embed: embed })
        }
        catch (err) {
            console.log(err);
        }
    }
}