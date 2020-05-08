import Command from "@command/Command";
import { Moderation } from "~/Groups";
import CommandEvent from "@command/CommandEvent";
import { MessageEmbed, TextChannel, Message } from "discord.js";

export default class Submit extends Command {
    constructor() {
        super({ name: "Submit", triggers: ["submit", "report"], description: "Generates a report on a specified user", group: Moderation });
    }

    async run(event: CommandEvent) {
        try {
            const message = event.message;
            const argument = event.argument;
            const database = event.client.database;

            const guild = await database?.guilds.findOne({ id: message.guild!.id });
            const [user, reason, evidence] = argument.split('|');
            let id = guild?.reports.length || 1;
            if (id !== 1) {
                id += 1;
            }
            
            await database?.guilds.updateOne({
                id: message.guild?.id
            }, {
                "$push": {
                    reports: {
                        id: id,
                        user: user,
                        reason: reason,
                        evidence: evidence,
                        staff: message.author.tag,
                        handled: false
                    }
                }
            })
            let channel;

            const embed = new MessageEmbed()
                .setTitle(`Case: ${id}`)
                .addField(`User`, user)
                .addField(`Staff`, message.author.tag)
                .addField(`Reason`, reason)
                .addField(`Evidence`, evidence);

            channel = message.guild?.channels.cache.get(guild?.config.channels!.submitted!);
            (channel as TextChannel).send({ embed: embed })
                .then((msg) => {
                    msg as Message;
                    guild!.reports[id].message = msg.id;
                });
        }
        catch (err) {
            console.log(err);
        }
    }
}