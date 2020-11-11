import { ObjectId } from "bson";

export interface Roles {
    vip?: string;
    mvp?: string;
    staff?: string[];
}

export interface Channels {
    submitted?: string;
    suggestions?: string[];
}

export interface GuildConfig {
    prefix?: string;
    roles?: Roles;
    channels?: Channels;
}

export interface Report {
    id: number;
    user: string;
    reason: string;
    evidence: string;
    reporter: string;
    handled: boolean;
    type: boolean;
    message?: string;
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