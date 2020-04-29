import { MessageEmbed, Message, TextChannel } from "discord.js";
import { Database } from "./Database";

export async function SubmitReport(argument: string, message: Message, database: Database) {
    let channel;
    const guild = await database.guilds.findOne({ id: message.guild!.id });
    
    const [user, reason, evidence] = argument.split('|');
    const id = guild?.reports.length;
    const report = {
        id: id!,
        user: user,
        reason: reason,
        evidence: evidence,
        staff: message.author.tag,
        handled: false
    };
    guild!.reports.push(report);
    const embed = new MessageEmbed()
        .setTitle(`Case: ${report.id}`)
        .addField(`User`, report.user)
        .addField(`Staff`, report.staff)
        .addField(`Reason`, report.reason)
        .addField(`Evidence`, report.evidence);
    
    channel = message.guild?.channels.cache.get(guild?.config.channels!.submitted!);
    (channel as TextChannel).send({ embed: embed})
        .then((msg) => {
            msg as Message;
            guild!.reports[report.id].message = msg.id;
        });
}

export async function SolveReport(argument: string, message: Message, database: Database) {
    let channel;
    const id = parseInt(argument.split(' ')[0]);
    const guild = await database.guilds.findOne({ id: message.guild!.id });
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
    (channel as TextChannel).send({ embed: embed})
        .then((msg) => {
            msg as Message;
            guild!.reports[report.id].message = msg.id;
            oldreport?.delete();
        });
}