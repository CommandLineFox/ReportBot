import Command from "@command/Command";
import { OwnerOnly } from "~/Groups";
import CommandEvent from "@command/CommandEvent";
import { MessageEmbed, TextChannel, Message } from "discord.js";
import { Guild } from "@models/Guild";

export default class Test extends Command {
    constructor() {
        super({ name: "Test", triggers: ["test"], description: "Test command thing", group: OwnerOnly });
    }

    async run(event: CommandEvent) {
        try {
            const message = event.message;
            const argument = event.argument;
            const database = event.client.database!;

            let guild = await database!.guilds.findOne({ id: event.guild.id });
            if (!guild) {
                const newguild = new Guild({ id: event.guild.id });
                await database!.guilds.insertOne(newguild);
                guild = await database!.guilds.findOne({ id: event.guild.id });
            }

            if (!guild!.config.submitted) {
                event.send("There is no specified channel for me to send reports to.");
                return;
            }

            const [user, reason, evidence] = argument.split('|');
            let id = guild?.reports.length || 1;
            if (id !== 1) {
                id += 1;
            }

            let channel;
            let msgid;

            const embed = new MessageEmbed()
                .setTitle(`Case: ${id}`)
                .addField(`User`, user)
                .addField(`Reported by`, message.author.tag)
                .addField(`Reason`, reason)
                .addField(`Evidence`, evidence);

            channel = message.guild?.channels.cache.get(guild?.config.submitted!);
            (channel as TextChannel).send({ embed: embed })
                .then((msg) => {
                    msg as Message;

                    msgid = msg.id;
                });

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
                        handled: false,
                        message: msgid
                    }
                }
            })
        }
        catch (err) {
            console.log(err);
        }
    }
}