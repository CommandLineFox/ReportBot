import Command from "@command/Command";
import { Moderation } from "~/Groups";
import CommandEvent from "@command/CommandEvent";
import { MessageEmbed, TextChannel } from "discord.js";

export default class Submit extends Command {
    constructor() {
        super({ name: "Submit", triggers: ["submit"], description: "Generates a report on a specified user", group: Moderation });
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
                .addField(`Staff`, message.author.tag)
                .addField(`Reason`, reason)
                .addField(`Evidence`, evidence);

            const staffsubmitted = message.guild?.channels.cache.get(event.client.config.channels.staffsubmitted);
            (staffsubmitted as TextChannel).send({ embed: embed });
            message.delete();
        }
        catch (err) {
            console.log(err);
        }
    }
}