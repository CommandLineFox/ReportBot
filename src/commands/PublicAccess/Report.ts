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
            const channel = event.channel;

            if (argument.split('|').length != 3) {
                channel.send("Invalid arguments.")
                    .then((msg) => {
                        setTimeout(() => { msg.delete() }, 5000);
                    })
                message.delete();
                return;
            }
            const [user, reason, evidence] = argument.split('|');

            const embed = new MessageEmbed()
                .addField(`User`, user)
                .addField(`Reported by`, message.author.tag)
                .addField(`Reason`, reason)
                .addField(`Evidence`, evidence);

            const submitted = message.guild?.channels.cache.get(event.client.config.channels.submitted);
            (submitted as TextChannel).send({ embed: embed });
            message.delete();
        }
        catch (err) {
            console.log(err);
        }
    }
}