import { Client, ClientOptions, User, Guild, GuildMember } from "discord.js";
import configTemplate from "~/Config";
import { IFunctionType } from "~/ConfigHandler";
import CommandHandler from "@command/CommandHandler";
import { Database } from "@utils/Database";
import { EventHandler } from "./event/EventHandler";

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
