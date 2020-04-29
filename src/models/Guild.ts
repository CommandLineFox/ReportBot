import { ObjectId } from "bson";

export interface Report {
    id: number;
    user: string;
    reason: string;
    evidence: string;
    staff: string;
    handled: boolean;
    message?: string;
}

export interface GuildChannels {
    submitted: string;
    handled: string;
}

export interface GuildRoles {
    staff?: string[];
}

export interface GuildConfig {
    prefix?: string;
    channels?: GuildChannels;
    roles?: GuildRoles;
}

export interface GuildDoc {
    id: string;
    config?: GuildConfig;
    reports?: Report[];
}

export class Guild implements GuildDoc {
    _id: ObjectId;
    id: string;
    config: GuildConfig;
    reports: Report[];

    constructor(data: GuildDoc) {
        this._id = new ObjectId();
        this.id = data.id;
        this.config = data.config ?? {};
        this.reports = data.reports ?? [];
    }
}