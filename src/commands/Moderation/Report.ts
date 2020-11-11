import Command from "@command/Command";
import { PublicAccess } from "~/Groups";
import CommandEvent from "@command/CommandEvent";
import { MessageEmbed, TextChannel } from "discord.js";
import { Guild } from "@models/Guild";

export default class Report extends Command {
    constructor() {
        super({ name: "Report", triggers: ["report", "submit"], description: "Reports a specified user to staff", group: PublicAccess });
    }

    async run(event: CommandEvent) {
        try {
            const message = event.message;
            const argument = event.argument;
            const database = event.client.database!;
            const member = event.member;
            const client = event.client;

            let guild = await database!.guilds.findOne({ id: event.guild.id });
            if (!guild) {
                const newguild = new Guild({ id: event.guild.id });
                await database!.guilds.insertOne(newguild);
                guild = await database!.guilds.findOne({ id: event.guild.id });
            }

            if (!guild || !guild.config.channels || !guild.config.channels.submitted) {
                event.send("The reports channel doesn't exist.");
                return;
            }

            const [user, reason, evidence] = argument.split('|');
            let id = (guild?.reports.length) ? guild?.reports.length + 1 : 1;
            const type = (event.client.isMod(member, event.guild) || client.isAdmin(member)) ? true : false;

            const embed = new MessageEmbed()
                .setTitle(`Case: ${id}`)
                .addField(`User`, user)
                .addField(`Reported by`, message.author.tag)
                .addField(`Reason`, reason)
                .addField(`Evidence`, evidence);

            if (type) {
                embed.setColor("FF00FF");
            }
            else {
                embed.setColor("0000FF");
            }

            const channel = event.guild?.channels.cache.get(guild.config.channels.submitted);
            const msgid = (await (channel as TextChannel).send({ embed: embed })).id;
            message.delete();

            await database?.guilds.updateOne({
                id: message.guild?.id
            }, {
                "$push": {
                    reports: {
                        id: id,
                        user: user,
                        reason: reason,
                        evidence: evidence,
                        reporter: message.author.tag,
                        handled: false,
                        type: type,
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