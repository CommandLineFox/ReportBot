import { Client, ClientOptions, User, Guild, GuildMember } from "discord.js";
import configTemplate from "~/Config";
import { IFunctionType } from "~/ConfigHandler";
import CommandHandler from "@command/CommandHandler";
import { Database } from "@utils/Database";
import { EventHandler } from "./event/EventHandler";
import { Guild as GuildModel } from "@models/guild";

type configTemplate = typeof configTemplate;

export default class BotClient extends Client {
    readonly config: { [key in keyof configTemplate]: IFunctionType<configTemplate[key]> };
    readonly database?: Database;
    lastDmAuthor?: User;

    constructor(config: { [key in keyof configTemplate]: IFunctionType<configTemplate[key]> }, database?: Database, options?: ClientOptions) {
        super(options);
        this.config = config;
        this.database = database;
        this.once("ready", () => {
            new CommandHandler(this)
            EventHandler(this)
        });
    }

    public async getGuildFromDatabase(database: Database, id: string): Promise<GuildModel | null> {
        let guild = await database!.guilds.findOne({ id: id });
        if (!guild) {
            const newGuild = new GuildModel({ id: id });
            await database!.guilds.insertOne(newGuild);
            guild = await database!.guilds.findOne({ id: id });
        }

        return guild;
    }

    public async getMember(argument: string, guild: Guild): Promise<GuildMember | undefined> {
        if (!argument) {
            return;
        }

        const regex = argument.match(/^((?<username>.+?)#(?<discrim>\d{4})|<?@?!?(?<id>\d{16,18})>?)$/);
        if (regex && regex.groups) {
            if (regex.groups.username) {
                return (await guild.members.fetch({ query: regex.groups.username, limit: 1 })).first();
            } else if (regex.groups.id) {
                return guild.members.fetch(regex.groups.id);
            }
        }

        return (await guild.members.fetch({ query: argument, limit: 1 })).first();
    }

    async isMod(member: GuildMember, guild: Guild): Promise<Boolean> {
        const guildmodel = await this.database?.guilds.findOne({ id: guild.id });
        if (!guildmodel) {
            return false || this.isAdmin(member);
        }

        const moderators = guildmodel.config.roles?.staff;
        if (!moderators) {
            return false || this.isAdmin(member);
        }

        if (moderators.length === 0) {
            return false || this.isAdmin(member);
        }

        let mod = false;
        moderators.forEach(id => {
            if (member.roles.cache.some(role => role.id === id)) {
                mod = true;
            }
        })

        return mod || this.isAdmin(member);
    }

    isAdmin(member: GuildMember): boolean {
        if (member.permissions.has("ADMINISTRATOR")) {
            return true;
        }
        return false;
    }

    isOwner(user: User): boolean {
        return this.config.owners.includes(user.id);
    }

    async getPrefix(guild?: Guild): Promise<string> {
        if (guild) {
            let guilddb = await this.database!.guilds.findOne({ id: guild.id });
            if (!guilddb) {
                return this.config.prefix;
            }

            if (guilddb.config.prefix) {
                return guilddb.config.prefix;
            }
        }
        return this.config.prefix;
    }
}
